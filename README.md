<h1>RESTful Blog_App</h1>

<p>First ever full-stack functional app I made.</p>
<p>I used NodeJS and ExpressJS in the backend; Semantic-UI and its dependency, jQuery, for the frontent.</p>
<p>All pictures are credited to <a href="https://picsum.photos">Lorem Picsum Images</a>.</p>
<p>All placeholder texts are credited to <a href="http://generator.lorem-ipsum.info/">Professional Lorem Ipsum Generator</a>.</p>

<p>There are some codes I used in the frontent which I credit to some Stackoverflow and Google searches I made. Most of these codes are for implementing Semantic UI components.</p>

<p><strong>Notes:</strong></p>
A. For Locally Hosted :
<ol>
	<li>All node packages are included in this repo. Before cloning it, install nodeJS in your system.</li>
	<li>Check package.json and install all dependencies</li>
	<li>This repository does not include the database. Install MongoDB in your system and follow documentation to run mongod.exe and create root/data/db directory.</li>
	<li>seedDB() at line 50 of app.js is commented by default. Uncomment this line for new installations to have initial data.</li>
</ol>
B. For deployed sites on Heroku or other servers:
<li>Fork this repository</li>
<li>Follow your web service provider's instruction on creating space for app</li>
<li>Push repo to web server</li>
<li>Use mLab to create database that will be used by app (please use your own database username and password in connecting mongoose to mLab database by editing line 24 of app.js file)</li>