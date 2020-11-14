# Design of state and hierarchy to manage in this application.

## State List
The state list using in this application.
|#| state|Description|
|---|---|---|
|1 | authState  | Authenticate status using cognito. |
|2 | user  | Current login user informations using cognito. |
|3 | isDrawerOpen  | Handle drawer open or close. |
|4 | isDarkMode  |  Handle application contrast to switch light or dark mode. |

## Hierarchy of components and states
### Overview

- App
  - GenericTemplate
    - AppBar
    - Drawer
    - Footer
    - pages(child components like below.)
      - Landing(not login required only this page.)
      - LoginRequiredWrapper
        - MyBuckets
        - Player
        - ...etc

### Places of state declaration and where is used.

#### About states of `authState` and `user` 

|conponents   | useState  |createContext| useContext|
|---|---|---|---|
| App  |authState<br>user | AuthContext(authState, setAuthState)<br>UserDataContext(user,setUser)| - |
| genericTemplate | - | - | -|
| AppBar  | - | - | AuthContext|
| Drawer  | - | - | AuthContext<br>UserDataContext |
| Landing  | - | - | - |
| LoginRequiredWrapper | - | - |AuthContext<br>UserDataContext |
| MyBuckets  | -  | - | - |
| Player  | - | - | - |
| Signin  | - | - |  AuthContext|
| Signup  | - | - |  AuthContext|


#### About states of `isDrawerOepn` and `isDarkMode` 

| conponents | useState | using props | 
|---|---|---|
| App | - |
| genericTemplate  |isDrawerOpen<br>isDarkMode | - |
| AppBar | - | isDrawerOpen<br>isDarkMode  |
| Drawer | - | isDrawerOpen<br>isDarkMode  |
| Landing | - | - |
| LoginRequiredWrapper | - | - |
| MyBuckets | - | - |
| Player | - | - |
