# Youtube-Chat Application

The Youtube-Chat application solves a problem that I have recently encountered. Currently there isn't a proper tool to watch videos with your family or friends simultaneously. With the use of sockets, we are able to sync videos on multiple users' computers, monitor the host's latency, and each client's latency to allow devices in the same room to be synced *perfectly*. To use this web application, please go to [application link](https://chat-31768.firebaseapp.com/ "Youtube-Chat Application").

How the application works:
1. Create an account - don't worry, all passwords are hashed and salted using bcrypt (https://www.npmjs.com/package/bcrypt)
2. Create a room in the 'Me' tab or go to one of your owned rooms. You can also change your display name in this tab.
3. Once you have created a room, you should be redirected there. The default video is from the movie 'Storks' in a scene which is extremely awkward. Enjoy!
4. Since you are the owner of the room, you can change the video URL - works well with Youtube and Kissanime Alpha Server URL links, pause/play and seek/skip the video.
5. Let your friends know what the room name is and forward them to the application's homepage. There, they will see the active rooms and all rooms. If the video isn't the same, go back to the home page and re-click the room - this is a known bug.
6. Finally, there is a real-time chat application that stores the room's chat history underneath the video.
7. HAVE FUN :D

## Built With

* [Node.js w/ Express.js and Socket.io](https://nodejs.org/en/) - The backend framework used
* [React.js](https://reactjs.org/) - The frontend framework used
* [MongoDB](https://www.mongodb.com/) - Used as the database solution


## Author

* **Arjun Bhushan**
