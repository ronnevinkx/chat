# Deploy a NodeJS React app to AWS EC2

## Prepare the code

1. Update client links to be relative to new host
2. Create a .env and use env vars for DB credentials
3. Push the code to a git repo

## Set up the EC2 instance:

1. Launch an EC2 instance
2. Connect to it and install NodeJS on it

## Set up the RDS instance:

1. Launch an RDS instance
2. Set up a user and password for the server to access it
3. Connect to it and create your app's schema

## Set up nginx

1. Install nginx
2. Update server blocks and map / to client and /graphql to server
3. Build client files and copy them to where nginx is serving from

## Set up pm2

1. Install pm2
2. Add the server as a process

**Done**

---

## Solution for SSH error "unprotected private key file":

How to fix the unprotected private key file error?
If you’re on a Mac, follow these instructions:

1. Find your .pem key file on your computer. It doesn’t matter where it is, but just identify it in Preview as you’ll need to drag/drop it soon.

2. Open Terminal and type the following:

chmod 400 3) Assuming your cursor is after the 600, now drag and drop the .pem key file onto Terminal. The final result will look something like this but please note that your .pem key filename and location path will be different than my example below.

`chmod 400 /Users/myself/Documents/MyAccessKey1.pem`
NOTE: If you don’t intend on ever editing the file – which is most likely – then, chmod 400 is the more secure and appropriate setting. If you do intend on editing the .pem key file, then use chmod 600 instead of chmod 400 because that will allow the owner read-write access and not just read-only access.

4. Press Enter. Nothing magical will happen nor will you get a confirmation from Terminal. It’ll just work. Now, you can try to SSH to your EC2 instance on AWS and tackle the next headbanger.

---

## Generate deploy key

1. Log in using SSH: get public IPv4 from EC2, then cd into folder with `chat.pem` and enter:
   `ssh -i chat.pem ubuntu@[ip]`
2. Go into SSH folder: `cd .ssh`
3. Generate SSH key: `ssh-keygen -t ed25519 -C "ronnevinkx@gmail.com"`
4. Get key: `vim id_ed25519.pub`
5. Copy text and go to GitHub repo settings, add deploy key

---

## Install Node and app dependencies

1. Get SSH endpoint of repo
2. Cd into root of server and `git clone git@github.com:ronnevinkx/chat.git chat.com`
3. Cd into `chat.com`
4. Get Node: get curl command for Node 12.x from https://github.com/nodesource/distributions and run on server: `curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -`
5. Install Node: `sudo apt-get install -y nodejs`
6. Check if installation succeeded: `node -v`, `npm -v`
7. Install dependencies: `cd chat.com && npm i`
8. Install dependencies for client: `cd client && npm i`
9. Fix vulnerabilities: `npm audit fix`

---

## Set up database

1. Set up database with RDS, get credentials and endpoint
2. Copy .env.example to a new .env: `cp .env.example .env`
3. Fill out .env: `vim .env` and save: `esc :x`
4. Install sequelize CLI: `sudo npm i -g sequelize-cli`
5. Create db: `sequelize db:create`
6. Run migrations: `sequelize db:migrate`
7. Run seeds: `sequelize db:seed:all`

---

## Nginx

1. `sudo apt install nginx`
2. Allow HTTP access: go to security group of instance, add HTTP to inbound rules
3. Build app, cd into client and run `npm run build`
4. `sudo mkdir /var/www/chat.com`
5. Own as this user: `sudo chown -R $USER:$USER /var/www/chat.com`
6. Copy all build files to /var/www/chat.com: `cp -r build/* /var/www/chat.com/`
7. `cd /etc/nginx`
8. `cd sites-available`
9. `sudo vim default`
10. Change respective lines to: `try_files $uri /index.html;` and `root /var/www/chat.com;`
11. Restart nginx: `sudo systemctl restart nginx`
12. Hooray! We now have a frontend at our IP address!

---

## GraphQL Server

1. `cd` to go back to root and then `cd chat.com`
2. Install pm2: `sudo npm i -g pm2`
3. `pm2 start server.js --name "server"`: gives list of processes, server.js is now online and working
4. set up reverse proxy: `sudo vim /etc/nginx/sites-available/default`
5. type in below `location {...}` block:

```
location /graphql/ {
	proxy_pass http://localhost:4000/;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
}
```
