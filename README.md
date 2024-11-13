# RookCook

Welcome to **RookCook**, an innovative online platform designed to revolutionize home cooking by providing personalized recipe suggestions tailored to the ingredients and kitchen tools users have available. Our mission is to make cooking more accessible, efficient, and enjoyable for everyone, regardless of their culinary expertise or dietary preferences. By leveraging advanced algorithms, RookCook accurately matches available ingredients with a diverse array of recipes, minimizing waste and ensuring each meal is delicious and resourceful. The platform’s integration of kitchen tools enhances the cooking experience by offering practical and efficient recipe suggestions that consider the specific appliances users own. Users can create personalized profiles, save their favorite recipes, and review dishes, fostering a personalized and engaging experience. Additionally, RookCook aims to build a vibrant community of cooking enthusiasts through features such as recipe reviews and culinary discussion forums, where users can share tips, ask questions, and connect over their shared love of food. Committed to promoting informed cooking choices, RookCook provides comprehensive nutritional information for each recipe, helping users track their dietary intake and plan balanced meals. Overall, RookCook seeks to transform home cooking into a more accessible, enjoyable, and community-oriented activity, empowering users to explore their culinary creativity with confidence and convenience.

## Features

- **Interactive Kitchen Environment**: Enjoy a realistic kitchen background with subtle animations. Interactive elements, like a recipe book on the counter, allow you to open a search interface with options for categorized browsing or keyword search.
  
- **Ingredients Manager**: Add and remove ingredients to narrow down your search results to recipes that include items you already have in your fridge.

- **Search and Filter**: Search for recipes by name, ingredients, or categories, and filter results based on dietary preferences or cooking time.

- **Review System**: Rate recipes after trying them and share your experiences with other users.

- **Discussion Forum**: Interact with other users, ask or answer questions regarding recipes, and share tips and suggestions for better cooking experiences.

- **User Profiles**: Manage your profile, adjust your username, change your profile picture, store ingredients, and manage preferences.

## Local Installation Instructions

To set up RookCook locally, follow these steps:

1. **Clone the Project**:
   ```bash
   git clone https://github.com/RookCookCo/RookCook.git
   ```

2. **Navigate to Your RookCook Project mernRC Directory**:
   ```bash
   cd /[path to project]/RookCook/mernRC
   ```

3. **Install Dependencies and Build Assets**:
   ```bash
   npm install
   npm run build
   ```

4. **Start Local Server**:
   ```bash
   npm start
   ```

## Database Setup

1. Navigate to the backend directory:
   ```bash
   cd /[path to project]/RookCook/mernRC/backend
   ```
2. Install dependencies and build assets:
   ```bash
   npm install
   ```
   - If a dependency is missing, such as `mongoose`, install it separately:
     ```bash
     npm install mongoose
     ```
3. Start the local server:
   ```bash
   node server.js
   ```

## Repository Navigation

Please only refer to the `RookCook/mernRC/src` and `RookCook/mernRC/backend` folders. These directories contain the core frontend and backend code of the application. All other folders were part of the initial MERN stack installation, and we have not modified them, as we are unsure if deleting them will affect deployment.

- **Frontend**: The frontend code is located in the `mernRC/src` folder. This directory contains all the components, styles (component CSS), and assets needed to build the user interface of the application. You can explore this folder to understand how the UI is structured and where specific components are implemented.

- **Backend**: The backend logic is housed in the `mernRC/backend` folder. This directory includes server setup and database models. Navigate through this folder to see how the server is configured and how it interacts with the database.

## Usage

Once the application is running, you can:

- **Browse and Search for Recipes**: Discover a wide variety of recipes by searching through ingredients, cuisines, or meal types to find the perfect dish for any occasion.
- **Set Preferences in the User Profile**: Customize your experience by adjusting your profile settings, including dietary preferences and ingredient availability, to receive tailored recipe recommendations.
- **Participate in the Discussion Forum**: Engage with a community of fellow cooking enthusiasts by asking questions, sharing tips, and exchanging ideas to enhance your culinary skills.

## Contributing

We welcome contributions to RookCook! If you have ideas for new features or improvements, please submit a pull request. Ensure your code follows our coding standards and is well-documented.

## License

RookCook is licensed under the MIT License. See the `LICENSE` file for more information.

## Contact

For questions or support, please contact us at rookcookco@gmail.com.

Thank you for using RookCook! We hope it enhances your cooking experience.
