#!/bin/bash
## Installation script for MIST (Mathematical Image Synthesis Toolkit)
## Copyrighted by Zaen LOL (jk idk how it works)

do_backend_installation=true
do_frontend_installation=true

## Check npm version
echo "Using npm version: $(npm -v)"

## Check if node_modules & package-lock.json already exists

prompt_overwrite(){
if [ -d "./$1/node_modules" ] || [ -f "./$1/package-lock.json" ] || [ "$(docker ps -a | grep MIST-db)" ] || [ "$(docker ps -a | grep MIST-backend)" ]
then
    read -r -p "It appears that project is already set up on the $1. Would you like to re-install? [y/N]" response
    case "$response" in
        [Yy][Ee][Ss]|[Yy])
            echo "Removing node_modules and package-lock.json..."
            (cd $1 && rm -rf node_modules package-lock.json)
            eval "${2}=true";;
        *)
            eval "${2}=false";;
    esac
fi
}

prompt_overwrite backend do_backend_installation
prompt_overwrite frontend do_frontend_installation

if [ "$do_backend_installation" == "true" ]; then
    echo "You can either choose to run a local PostgreSQL instance, or use a Docker container to host the backend.
Docker is strongly recommended."
    select method in "Local" "Docker"; do
        case "$method" in
            "Local" )
                # Check if postgres is installed
                echo "Checking if Postgres is installed..."
                which psql > /dev/null
                if [[ $? == 0 ]]; then
                    # Postgres is installed, check if it's running on port 5432
                        echo "Checking if Postgres is running..."
                        if ! [[ $(netstat -an --tcp --program | grep 5432) ]]; then
                            # Not running, start postgres
                            echo "PostgreSQL is not running, or it is running but not on port 5432."
                            echo "Zaen is too tired to figure out how to run postgres on your OS. Google or smth!"
                            exit 1
                        else
                            # All good! Do npm install
                            "Installing node packages for the backend..."
                            (cd backend && npm install)
                        fi
                else 
                    echo "PostgreSQL is not installed. Please install PostgreSQL by following README.md."
                    exit 1
                fi
                break;;
            "Docker" )
                # Check if Docker is installed
                type docker > /dev/null
                if [[ $? == 0 ]]; then
                    # Check if docker-compose is installed
                    type docker-compose > /dev/null
                    if [[ $? == 0 ]]; then
                        echo "Making sure that there's no MIST instances running..."
                        docker rm -v MIST-backend --force
                        docker rm -v MIST-db --force
                        echo "Setting up Docker for the backend..."
                        (cd backend && docker-compose up --build -d)
                    else
                        echo "Docker-compose is not installed. Please install it alongside Docker."
                        exit 1
                    fi
                else
                    echo "Docker is not installed. Please install Docker by following README.md."
                    exit 1
                fi
                break;;
        esac
    done
fi

if [[ "$do_frontend_installation" == "true" ]]; then
    echo "Installing the frontend..."
    (cd frontend && npm install)
    # Remove the two lines after upgrading the frontend react packages to v.17
    echo "Removing the eslint folder (so annoything maaan)"
    (cd frontend && rm -rf node_modules/eslint)
    echo "Downloading the twgl.js file..."
    curl -sL https://raw.githubusercontent.com/greggman/twgl.js/4f6b81a3a8a73fbda701b68536703a4c04a9b192/dist/4.x/twgl.min.js --output ./frontend/public/twgl.min.js
    echo "Starting up the frontend..."
    (cd frontend && npm run start)
fi

exit 0

