![Airbrush Logo](https://i.imgur.com/sY5Qeh2.png)
<p>
https://www.airbrush-ai.com/
<p>
https://youtu.be/DRLelWtegkU

# Unleash your inner Bob Ross with an AI-powered canvas tool
Paint the air with just your browser and your hands using AIrbrush

## Why Airbrush?
We wanted to create the most unique drawing experience you've ever had. So, we built a canvas web application that unlocks your body motions to draw in the air, displaying your strokes in real time. Users can trace lines or shapes in various colors using either the left or right hand (or nose for optimal desktop use), stop and start drawing with a gesture, and utilize voice commands with Chrome's Web Speech API. 

## How the "magic" happens
To make the magic happen, we used PoseNet, a model of Google Brain's TensorFlow.js library. PoseNet’s heatmap tensors analyze webcam images to track 17 body points, including nose, shoulders, elbows and wrists, to track your body as it moves. We applied cross-frame and Kalman filters to the output data for the smoothest possible path, as well as a custom-trained MobileNet model to trigger line changes by opening or closing one’s hand. Because Airbrush is a client-focused app, we prioritized user experience, interactivity and satisfaction over back-end logic for the scope of this project. Starting with a Node server with an Express framework , we built the interactivity of our canvas with React, and managed its state with Redux. 

For the best experience, please run our app in Chrome. This technology is in the early stages of development, so speech capability remains TK for other browsers.

## The Airbrush Team
Amber Rodriguez, Laura Waters, Kathleen Gilbert, Wenyi Zheng

