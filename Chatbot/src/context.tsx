import {createContext,} from 'react'

interface MyContextType {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const MyContext = createContext<MyContextType | null>(null);
// const ContextProvider = ({ children }: { children: React.ReactNode }) => {
//     // const [username, setUsername] = useState("");
//   return (
//     <MyContext.Provider>
//       {children}
//     </MyContext.Provider>
//   );
// }

// export { MyContext};