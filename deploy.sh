#!/bin/bash

# ------------------------
#  Load Configuration from File
# ------------------------

# Set the path to your configuration file
CONFIG_FILE="deploy.env"

# Load the environment variables from the file
if [ -f "$CONFIG_FILE" ]; then
	source $CONFIG_FILE
else
	echo "Error: Configuration file '$CONFIG_FILE' not found."
	exit 1
fi

# ------------------------
#  Read Configuration from Environment Variables
# ------------------------

# Make sure the following environment variables are set before running the script
if [ -z "$M21_WEB_PROJECT_DIR" ]; then
	echo "Error: \$M21_WEB_PROJECT_DIR environment variable is not set."
	exit 1
fi

if [ -z "$M21_WEB_WEBSERVER_ADDRESS" ]; then
	echo "Error: \$M21_WEB_WEBSERVER_ADDRESS environment variable is not set."
	exit 1
fi

if [ -z "$M21_WEB_REMOTE_WEB_DIR" ]; then
	echo "Error: \$M21_WEB_REMOTE_WEB_DIR environment variable is not set."
	exit 1
fi

# -----------------------------------------
#  Build the Next.js Project for Static Output
# -----------------------------------------

cd $M21_WEB_PROJECT_DIR

# Ensure dependencies are installed
yarn

# Check if the 'out' folder exists, delete if found
if [ -d "./out" ]; then
	rm -rf ./out
fi

# Build the Next.js project as a static output
yarn build

# -----------------------------------
#  Delete Existing Files and Upload
# -----------------------------------

# Delete current files on the remote web server
ssh $M21_WEB_WEBSERVER_ADDRESS "rm -rf $M21_WEB_REMOTE_WEB_DIR/*"

# Copy the static output files to the remote web server
scp -r ./out/* $M21_WEB_WEBSERVER_ADDRESS:$M21_WEB_REMOTE_WEB_DIR

echo "Deployment Complete!"
