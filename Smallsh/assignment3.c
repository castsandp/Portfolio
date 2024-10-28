#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <time.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <signal.h>


// golbal variable to communicate with the signal handler
int foregroundOnlyMode = 0;

// ctrl z signal handler prottotype
void handle_SIGTSTP(int signo);


/*the entire shell is within the main function,
mainly functions within the while loop, 
there are if statments checking what the arguments contain
depending on the commands forking can occur as well as redirection and signal usage*/
int main () {

    // initlize to 0
    foregroundOnlyMode = 0;
    
    // inililize and call all the signals
    struct sigaction SIGTSTP_action = {0};
    SIGTSTP_action.sa_handler = handle_SIGTSTP;
    sigfillset(&SIGTSTP_action.sa_mask);
    SIGTSTP_action.sa_flags = 0;
    sigaction(SIGTSTP, &SIGTSTP_action, NULL);


    // will ignore sigint
    signal(SIGINT, SIG_IGN);
    
    // flags for status build in command
    int forSignal = false;
    int forExit = false;
    
    // process info - storage variables
    int mainExitStatus;
    int backgroundProcess[10000];
    int numberOfBackgroundProcesses = 0;

    for(int i = 0; i < 10000; i++) {
        backgroundProcess[i] = 0;
    }
    
    //store command line arguments
    char command[2048];
    char* arguments[512];
    char currDir[2048];

    // allow program to continue repeating
    while(true) {
        //foregroundSwitch = 0;

        //checks on the background proceeses  - before allow user to have terminal access
        for(int i = 0; i < numberOfBackgroundProcesses; i++) {
            
            // current child process in the array
            int childPID = backgroundProcess[i];
            int exitStatus = -5;

            // checks status
            childPID = waitpid(childPID, &exitStatus, WNOHANG);

            // exited then
            if(childPID != 0 ) {
                
                // check signal or exit value and print info
                if (WIFEXITED(exitStatus)) {
                    printf("background pid %d is done, exit value %d\n", childPID, exitStatus);
                    fflush(stdout);
                } else if (WIFSIGNALED(exitStatus)) {
                    printf("background pid %d is done: terminated by signal %d\n", childPID, exitStatus);
                    fflush(stdout);
                }

                // if the process has finished then it takes it out of the array - resizes
                for(int k = i; k < numberOfBackgroundProcesses; k++) {
                    backgroundProcess[k] = backgroundProcess[k+1];

                }
                numberOfBackgroundProcesses--;
                i--;

            }

        }

        // prints the directory and allows the user to enter commands
        printf(": ");
        fflush(stdout);

        int toBackground = 0;
        
        // fgets() - does reads from the command line // checks not empty
        if (fgets(command, sizeof(command), stdin) == NULL) {
            continue;
        }


        // allows the program to support blank lines
        if (strcmp("\n", command) == 0) {
            continue;
        }

        // begins to tokenise the command string into sperate arguments
        int argument_count = 0;
        char* token = strtok(command, " \n");

        while(token != NULL) {
            arguments[argument_count] = token;
            argument_count++;
            token = strtok(NULL, " \n");
            
        }
        arguments[argument_count] = NULL;

        //built in functions begin

        
        for (int i = 0; i < argument_count; i++) {
                
                // will check if that argument has $$
                char* sub_arg[32];
                int sub_arg_count = 0;

                char* expand_pid = strstr(arguments[i], "$$");
                if (expand_pid != NULL) {
                    
                    // if so - will break it apart
                    int pid = getpid();

                    // will no hold the value of argiments at i
                    char argumentToChange[32];
                    strcpy(argumentToChange, arguments[i]);

                    // will begin to break it apart
                    char* arg_token = strtok(argumentToChange, "$$");

                    while(arg_token != NULL) {
                        sub_arg[sub_arg_count] = arg_token;
                        sub_arg_count++;
                        arg_token = strtok(NULL, "$$");
                    }
                    sub_arg[sub_arg_count] = NULL;
                    
                    // combine the tokens with the pid
                    
                    if(sub_arg[0] == NULL) {
                        sprintf(argumentToChange, "%d", pid);
                        strcpy(arguments[i], argumentToChange);
                    } else if (sub_arg_count == 2){
                        sprintf(argumentToChange, "%s%d%s", sub_arg[0], pid, sub_arg[1]);
                        strcpy(arguments[i], argumentToChange);
                    } else {
                        sprintf(argumentToChange, "%s%d", sub_arg[0], pid);
                        strcpy(arguments[i], argumentToChange);
                    }

                    // arg i will now hold the new string
                    
                }

        }
        // continue tokenizing argument untill there are no $$ present
            
        
        
        // checks the first argument for exit - returns if found
        if (strcmp("exit", arguments[0]) == 0) {
            return 0;
        }

        // checks the first argument for status - if so retruns the exit value or signal of the last ran forground process
        if (strcmp("status", arguments[0]) == 0) {
            
            // flags where changed when forgeound completed - used to check how the process ended
            if (forExit) {
                printf("exit value %d\n", mainExitStatus);
                fflush(stdout);

            } else if (forSignal) {
                printf("terminated by signal %d\n", mainExitStatus);
                fflush(stdout);

            } else {
                printf("exit value 0\n");
                fflush(stdout);
            }

            // checks that & will be ignored in status
            if (strcmp("&", arguments[argument_count-1]) == 0) {
                printf("process needs to run in the background - ignored\n");
                fflush(stdout);

                arguments[argument_count-1] = NULL;
                argument_count--;
            }

            continue;
        }

        // allows for the command line to hold a comment
        char* check_all = strstr(arguments[0], "#");
        if (check_all != NULL) {
            continue;
        } else if (strcmp("#", arguments[0]) == 0) {
            continue;
        }

        //built in cd command - moves between directories
        if (strcmp("cd", arguments[0]) == 0) {
            //printf("made it to the cd if\n");
            
            // checks if the cd had additional commands
            if(arguments[1] == NULL) {
                chdir(getenv("HOME"));
            } else {
                if(chdir(arguments[1]) != 0) {
                    printf("could not enter that directory!\n");
                    fflush(stdout);
                }
            }

            // checks that there was no following & in same cd command - if so removes it
            if (strcmp("&", arguments[argument_count-1]) == 0) {
                printf("process needs to run in the background - ignored\n");
                fflush(stdout);

                arguments[argument_count-1] = NULL;
                argument_count--;
            }
            
            continue;  
        }

        // checks if the proces needs to run in the background
        if (strcmp("&", arguments[argument_count-1]) == 0) {
            
            // removes & before sneding to exec
            arguments[argument_count - 1] = NULL;
            argument_count--;

            // diffrent statement depending on foreground mode
            if(!foregroundOnlyMode) {
                toBackground = 1;
                printf("process needs to run in the background\n");
                fflush(stdout);
            } else {
                printf("process needs to run in the background - ignored\n");
                fflush(stdout);
            }
        }

        // process has made it ot hte forking stage
        pid_t id = fork();

        if(id < 0) {

            // forked failed
            printf("fork did not work\n");
            fflush(stdout);
            break;
        } else if (id == 0) {

            signal(SIGTSTP, SIG_IGN);

            // child process
            if(toBackground == 1) {
                int back_file = open("/dev/null", O_RDWR);

                int a = dup2(back_file, 0);
                int b = dup2(back_file, 1);

                printf("process has been sent to the back\n");
                fflush(stdout);
                if( a == -1 || b == -1) {
                    perror("dup2");
                    exit(2);
                }
            }  else if (toBackground == 0) {
                signal(SIGINT, SIG_DFL);
            }

            //only check for redirection when the arguemnts are 3 or greater
            //input redirection
            // this redirection overidde the dev null one
            if (argument_count >= 3) {
                
                // checka the argument for a redirection sign
                for (int i = 0; i < argument_count; i++) {
                    
                    // when there < it is taking the contents of the file to the right and sending that to the contents to the left
                    if (strcmp("<", arguments[i]) == 0) {

                        // should open file ot the right - to read
                        int right_content = open(arguments[i+1], O_RDWR); // O_RDWR?

                        // redirects
                        int result = dup2(right_content, 0);
                        
                        // in the case of an error
                        if( result == -1) {
                            perror("dup2");
                            exit(2);
                        } 

                        // moves the arguments down to get rid of the redirection information
                        for(int k = i; k < argument_count; k++) {
                            arguments[k] = arguments[k+2];
                            
                        }

                        // changes the count 

                        argument_count -= 2;

                        break;
                    }

                }

                //output redirection
                for (int i = 0; i < argument_count; i++) {

                    // when there is > it is redirecting the output of the left comand and sending that output to the object to the right
                    if (strcmp(">", arguments[i]) == 0) {
                        
                        // opening the file where output needs to go
                        int outPutFile = open(arguments[i+1], O_RDWR| O_CREAT, 0660);
                        
                        //redirecting
                        int outputResult = dup2(outPutFile, 1);
                        
                        //incase of an error
                        if( outputResult == -1) {
                            perror("dup2");
                            exit(2);
                        }

                        // removes the last two arguments
                        arguments[i] = NULL;
                        arguments[i++] = NULL;

                        argument_count -=2;

                        break;

                    }

                }  
            } 

        
            int execvp_error = execvp(arguments[0], arguments);
            
            // will catch execvp error
            if (execvp_error = -1) {
                printf("unknown command: ");
                for(int i = 0; i < argument_count; i++) {
                    printf("%s ", arguments[i]);
                    fflush(stdout);
                }
                printf("\n");
                
                // make sure to update for status command
                if (WIFEXITED(mainExitStatus)) {
                    forExit = true;
                    forSignal = false;
                    mainExitStatus = execvp_error;
                    
                } else if (WIFSIGNALED(mainExitStatus)) {
                    forSignal = true;
                    forExit = false;
                    mainExitStatus = execvp_error;
                }
                perror("exec");
                exit(EXIT_FAILURE);
            }

        } else {

            // parent porcess

            //not background
            if(!toBackground) {
                
                // check the exit value of the forground process
                waitpid(id, &mainExitStatus, 0);

                // checsk signal or exit - update for status
                if (WIFEXITED(mainExitStatus)) {
                    forExit = true;
                    forSignal = false;
                    
                    mainExitStatus = WEXITSTATUS(mainExitStatus);
                    
                } else if (WIFSIGNALED(mainExitStatus)) {
                    forSignal = true;
                    forExit = false;
                    mainExitStatus = WTERMSIG(mainExitStatus);
                    
                    printf("signal terminated most recent forground: terminated by signal %d\n", mainExitStatus);
                    fflush(stdout);
                }



            } else {
                
                // background process
                backgroundProcess[numberOfBackgroundProcesses] = id;
                numberOfBackgroundProcesses++;
                printf("%d\n", id);
                fflush(stdout);
            }


        }

    }


}

/*SIgnal handler for SIGTSTP with a changed behavior - switches between foreground allowed to 
no foreground allowed - some process will ignore default dehavior.
*/
void handle_SIGTSTP(int signo) {

    // messages depend on mode
    if (foregroundOnlyMode) {

        // do not allow
        char* message = "Exiting forground-only mode\n";
        write(STDOUT_FILENO, message, 29);
        foregroundOnlyMode  = 0;
        fflush(stdout);

    } else if (!foregroundOnlyMode) {

        // allow foreground process
        char* message = "Entering forground-only mode (will now be ignoring &)\n";
        write(STDOUT_FILENO, message, 55);
        foregroundOnlyMode = 1;
        fflush(stdout);

    }

}
