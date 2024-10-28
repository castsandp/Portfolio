CC=gcc --std=gnu99 -g

EXE_FILE = smallsh

all: $(EXE_FILE)

$(EXE_FILE): assignment3.o
	$(CC) assignment3.o -o $(EXE_FILE)

assignment3.o: assignment3.c
	$(CC) -c assignment3.c

clean:
	rm -f *.o $(EXE_FILE)