Note that all my knowledge comes from Rob Hess: https://web.engr.oregonstate.edu/~hessro/teaching/cs290-sp21

# Getting started
You will need to download the files and then run "npm install" to install all the dependencies from the "package.json" file.

Once npm install is done, you should be good to start both the cat server and the dog server.

You will need 2 terminal windows to do this, one for each server. In each window type "npm run catStart" and "npm run dogStart" respectively.

In theory everything should work, and you should be able to access the websites at "localhost:3000" and "localhost:3001" respectively.

# Looking into the commands
If you want to look at what the npm commands to, look in the "package.json" file. Note that it uses nodemon to run the servers.

Nodemon is just a version that will restart the server whenever the server file i.e. "CatServer.js" or "DogServer.js" changes


# Why does it say get cat photo when it's clearly text?
I struggled a lot with figuring out how to download photos from the internet. it would be nice if someone else would do this,
but I will also be looking up ways to do it and will update the github as soon as I have figured out how to get it.

Once you have the img data downloaded it would be as simple to send it as just to add it as a member variable of the object
that you send in the response in the server.

Note that I used Git Bash to run the code, but any terminal with node installed should work.

Please let me know if you have any questions.
