
# Project Overview

This is a MERN stack application designed as a travel planning and information platform.

## Backend

*   **Framework:** Node.js with Express.
*   **Database:** MongoDB with Mongoose for object data modeling.
*   **Authentication:** JWT (JSON Web Tokens) for securing API endpoints.
*   **API:** A RESTful API with the following resources:
    *   `/api/auth`: User registration and login.
    *   `/api/users`: User management.
    *   `/api/destinations`: Travel destination guides.
    *   `/api/reviews`: User reviews for destinations.
    *   `/api/itineraries`: User-created travel itineraries.
    *   `/api/favorites`: Managing user favorites.
    *   `/api/chat`: Real-time chat between users.

## Frontend

*   **Framework:** React.js with TypeScript.
*   **Styling:** Material-UI and Tailwind CSS.
*   **State Management:** React Context API for authentication.
*   **Features:**
    *   User authentication (login/register).
    *   Browse and search for travel destinations.
    *   View detailed information about destinations.
    *   Create, view, edit, and delete personal travel itineraries.
    *   Mark destinations and itineraries as favorites.
    *   Real-time chat with other users.

## Getting Started

*   **Backend:**
    1.  `cd backend`
    2.  `npm install`
    3.  `npm run dev`
*   **Frontend:**
    1.  `cd frontend`
    2.  `npm install`
    3.  `npm start`
