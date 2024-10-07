# Bookie

Bookie is a web application for managing and exploring bookmarks. It's built with React and uses Mongodb for authentication and data storage.

## Features

- User authentication (Sign up, Login, Logout)
- Add new bookmarks
- Update existing bookmarks
- Delete bookmarks
- Add bookmarks to fav
- View you fav bookmarks


## Technologies Used

- React.js
- Mongodb Atlas (Authentication)
- React Router for navigation
- Tailwind CSS for styling

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repository
   ```
   git clone https://github.com/Shubbu03/bookie.git
   ```

2. Navigate to the project directory
   ```
   cd bookie
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Set up Mongodb
   - Create a Mongodb project at Mongodb Atlas
   - Get url string for your app
   - Create a `.env` file in the root of your project and add your Mongodb url:
     ```
     PORT=3000
     MONGODB_URI=YOUR_CONNECTION_STRING_HERE
     JWT_SECRET=YOUR_JWT_SECRET
     ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Shubham Joshi - [GitHub](https://github.com/Shubbu03)

Project Link: [https://github.com/Shubbu03/bookie](https://github.com/Shubbu03/bookie)
