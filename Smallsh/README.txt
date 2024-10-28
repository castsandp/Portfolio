Sandra Castillo Palacios
castsand@oregonstate.edu

Description:
The main goal of this program was to create a shell. This shell uses forking and execvp which allows it to process diffrent types of command line commands.
There are three built in functions being cd, exit, and status - that have their own specififed fucntionlity betweeen the program. This shell supports directory change,
comment lines and blank lines. It can take in signals such as crtl z and ctrl c which have speciffiec actions. This shell supports redirection and foreground as well
background processes. Overall it should simulate a linux shell.


Compilation Process:
To compile this program there is a designated make file. To compile run make. This will automatically run with the
gcc --std=gnu99 compiler. Then run with the executable ./smallsh to execute the program.

* I did include the p3testscript in the zip file so to run the test script with this program, after making in the cwd run ./p3testscript 2>&1 and the test results
should be printed to the terminal.
