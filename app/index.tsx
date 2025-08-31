import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Moon, Sun } from "lucide-react-native";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const MainApp = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from AsyncStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("tasks");
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    };

    if (!loading) {
      saveTasks();
    }
  }, [tasks, loading]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id: string, newText: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  return (
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            className="flex-1 px-4"
            style={{
              paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center py-4">
              <Text className={`text-2xl font-bold ${textColor}`}>
                To-Do List
              </Text>
              <View className="flex-row items-center space-x-2">
                <Sun size={20} color={isDarkMode ? "#fff" : "#000"} />
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                />
                <Moon size={20} color={isDarkMode ? "#fff" : "#000"} />
              </View>
            </View>

            {/* Task List */}
            {loading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </View>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleComplete={toggleTaskCompletion}
                onEditTask={editTask}
                onDeleteTask={deleteTask}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Task Input (sticks above keyboard) */}
            <TaskInput onAddTask={addTask} isDarkMode={isDarkMode} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
