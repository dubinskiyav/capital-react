1. Установить git
2. Установить OpenJDK   sudo apt-get install default-jdk
3. Установить https://nodejs.org/en/
   sudo apt update
   sudo apt upgrade
   sudo apt install nodejs
   установить npm, диспетчер пакетов Node.js
    sudo apt install npm
4. полезное видео https://www.youtube.com/watch?v=riRrKFkbS-g&ab_channel=WebDeveloperBlog
5 Установить React глобально на компьютере
      sudo npm install -g create-react-app
6. Установить https://code.visualstudio.com/
7. Установить пакеты расширений для него https://marketplace.visualstudio.com/items?itemName=waderyan.nodejs-extension-pack
   Babel JavaScript  https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel
8. Создаеть пустой проект
     npx create-react-app my-app
     cd my-app
     npm start

9. Клонировать мой проект (в заранее созданной папке)
     git clone https://github.com/dubinskiyav/capital-react.git

10. Зайти в папку capital-react и установить компоненты:
       https://ant.design/docs/react/introduce
        npm install antd

       все что ставим пакетным менеджером npm ставится в каталог node_modules.  Рядом с ним есть файл package.json в котором список пакетов, которые мы инсталлировали
11. Установить пакет request
        npm install reqwest
12. Пакет CORS
       https://coderlessons.com/tutorials/java-tekhnologii/learn-spring-boot/spring-boot-podderzhka-cors#:~:text=Cross%2DOrigin%20Resource%20Sharing%20(CORS,%D0%BA%D0%BE%D0%B4%D0%B0%20JavaScript%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2%20%D1%80%D0%B0%D0%B7%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D1%81%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F. 

     npm install cors

13. notifications:
      https://www.npmjs.com/package/react-notifications
       npm install --save react-notifications

14. Навигация
         https://www.npmjs.com/package/react-breadcrumbs-dynamic
          npm install --save react-through react-breadcrumbs-dynamic
          npm install --save react-router-dom
		  
15. Или установить все пакеты на которые есть зависимость в файле package.json
			npm install

16. Зайти в папку 
     capital-react\node_modules\react-scripts\config\
     найти файл webpackDevServer.config.js
    и в конец встаить
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    }
   вставить на одном уровне с after(app) {
  после должно быть две закрыв фигурные скобки с точками с запятой
       
17. Зайти в папку capital-react и выполнить
       npm start

      запустится браузер и перенйдет на страницу localhost:3000 где можно будет увидеть зачатки программы
	  
	  
	  


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
