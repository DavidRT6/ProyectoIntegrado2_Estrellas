import { createContext, useState } from 'react';

/**
 * Context for the application's components.
 */
const ScreensContext = createContext();

/**
 * Provider for contexts for the application's components.
 * 
 * @param {Object} props - Properties passed to the ScreensProvider component.
 * @param {ReactNode} props.children - The children elements of the component.
 * @returns {JSX.Element} - An JSX element that provides context to child components.
 */
export const ScreensProvider = ({ children }) => {
  const [id, setId] = useState(-1);
  const [room, setRoom] = useState(null);
  const [theme, setTheme] = useState('');
  const [email, setEmail] = useState(null);
  const [filterRooms, setFilterRooms] = useState([]);
  const [imagesRooms, setImagesRooms] = useState([]);
  const [entranceDateContext, setEntranceDateContext] = useState('');
  const [exitDateContext, setExitDateContext] = useState('');
  const [actualTheme, setActualTheme] = useState('lightblue');

  return (
    <ScreensContext.Provider
      value={{
        id,
        setId,
        room,
        setRoom,
        theme,
        setTheme,
        email,
        setEmail,
        filterRooms,
        setFilterRooms,
        imagesRooms,
        setImagesRooms,
        entranceDateContext,
        setEntranceDateContext,
        exitDateContext,
        setExitDateContext,
        actualTheme,
        setActualTheme,
      }}>
      {children}
    </ScreensContext.Provider>
  );
};

export default ScreensContext;