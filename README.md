<h1 align='center'>
MIST
</h1>
<p align="center">
MIST (or the Mathematical Image Synthesis Toolkit) is a tool for creating images and animations using simple math functions. You can make your own art from scratch, complete challenges, and share your creations with the MIST community.
</p>

# Contents

1. [Setting up for development](#setting-up-for-development)

2. [Documentation](#documentation)

3. [License](#license)

# Setting up for development

First of all, download and install Git and Node.js. For Node.js, grab the one with the latest features.

Git: https://git-scm.com/download/

Node.js: https://nodejs.org/en/download/

You can choose between installing a PostgreSQL instance or installing Docker and running the backend on a Docker instance. Make sure you install docker-compose as well.

- Installing Postgres

https://www.postgresql.org/download/

- Installing Docker

https://docs.docker.com/get-docker/

## Download & Setup the codebase

If you're on Windows, open the Git command line.
If you're on MacOS, open the Terminal (you can find it in the Application Launcher)

1. Clone the repository.

```
git clone https://github.com/GlimmerLabs/MIST.git
```

or if you have SSH set up,

```
git clone git@github.com:GlimmerLabs/MIST.git
```

2. Run the installation script in the Terminal. If you're on Windows, run it on the Bash Shell. (It should be included with Windows 10)
   The checking for PostgreSQL part does not work for Windows, because Windows is a bitch. Bill Gates you filthy money grabber

```
cd MIST
```

```
./setup.sh
```

(If you're running it the first time you might have to do `chmod +x ./setup.sh` first.)

The [setup.sh](setup.sh) script will do the following:

1. It will check if node_modules & package-lock.json exist in frontend or backend.

   You will be asked if you want to remove them and run npm install again should that be the case.

2. Next the script will ask you if you want to run the backend on the local instance of PostgreSQL or Docker. Then, it will check the selected method is available on the computer, and provide instruction to install & run it if it's not available.

3. The script will run `npm install` on frontend. There is a pesky bug with the code right now that requires the eslint folder inside node_modules to be removed. The script will take care of it!

# Documentation

(incoming...)

# License

(incoming...)
