# Converse

Converse is an OpenSource Chat Application built with React, Firebase and Redux.

It provides a headstart to create your own chat application.

## Steps to create your chat application with Converse

### 1. Download the complete project

Download the complete project and open it in your IDE of choice.
Then open the terminal section of IDE and enter either of the following lines and hit "enter".

```
npm install
```

_or_

```
yarn install
```

the above line would install all the required node modules and packages for this project to run.

### 2. Create _.env.local_ file on the **root** directory of the downloaded project

Make sure to create _.env.locale_ file before trying to run the application. This is to link the project with your Firebase project.

Copy the following lines and paste it inside the file.

```
REACT_APP_FIREBASE_API_KEY = REPLACE THIS COMMENT WITH YOUR FIREBASE API KEY

REACT_APP_FIREBASE_AUTH_DOMAIN = REPLACE THIS COMMENT WITH YOUR FIREBASE AUTH DOMAIN

REACT_APP_FIREBASE_PROJECT_ID = REPLACE THIS COMMENT WITH YOUR FIREBASE PROJECT ID

REACT_APP_FIREBASE_STORAGE_BUCKET = REPLACE THIS COMMENT WITH YOUR FIREBASE STORAGE BUCKET

REACT_APP_FIREBASE_MESSAGING_SENDER_ID = REPLACE THIS COMMENT WITH YOUR FIREBASE MESSAGING SENDER ID

REACT_APP_FIREBASE_APP_ID = REPLACE THIS COMMENT WITH YOUR FIREBASE APP ID

REACT_APP_FIREBASE_MEASUREMENT_ID = REPLACE THIS COMMENT WITH YOUR FIREBASE MEASUREMENT ID
```

Add your firebase porject's configuration onto the right hand side of the '=' in the above lines.

### 3. Setup is complete

With the above to steps done correctly, you are good to go with running your own converse chat application.

However,

To really make it your own, I recommend you to add your personal touch and flavour to the styling or the graphic elements.