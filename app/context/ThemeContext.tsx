import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    taskItem: string;
    completedText: string;
  };
}

const defaultLightColors = {
  background: "#FFFFFF",
  text: "#1A1A1A",
  card: "#F5F5F5",
  border: "#E0E0E0",
  primary: "#3B82F6",
  taskItem: "#FFFFFF",
  completedText: "#9CA3AF",
};

const defaultDarkColors = {
  background: "#121212",
  text: "#F5F5F5",
  card: "#1E1E1E",
  border: "#333333",
  primary: "#60A5FA",
  taskItem: "#1E1E1E",
  completedText: "#6B7280",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDarkMode: false,
  colors: defaultLightColors,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>("light");

  // Load saved theme preference from AsyncStorage on component mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        } else {
          // If no saved preference, use system preference
          setTheme(systemColorScheme === "dark" ? "dark" : "light");
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
        // Default to light theme if there's an error
        setTheme("light");
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Save theme preference to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("theme", theme);
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    };

    saveTheme();
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const isDarkMode = theme === "dark";
  const colors = isDarkMode ? defaultDarkColors : defaultLightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
