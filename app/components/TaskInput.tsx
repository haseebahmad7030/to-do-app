import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { PlusCircle } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

interface TaskInputProps {
  onAddTask: (text: string) => void;
  placeholder?: string;
  isDarkMode: boolean;  
}

const TaskInput = ({
  onAddTask = () => {},
  placeholder = "Add a new task...",
}: TaskInputProps) => {
  const [taskText, setTaskText] = useState("");
  const { isDarkMode } = useTheme?.() || { isDarkMode: false };

  const handleAddTask = () => {
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText("");
      Keyboard.dismiss();
    }
  };

  return (
    <View
      className={`flex-row items-center p-4 border-t ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <TextInput
        className={`flex-1 py-3 px-4 rounded-full mr-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
        value={taskText}
        onChangeText={setTaskText}
        onSubmitEditing={handleAddTask}
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={handleAddTask}
        className={`p-3 rounded-full ${taskText.trim() ? (isDarkMode ? "bg-blue-600" : "bg-blue-500") : isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        disabled={!taskText.trim()}
      >
        <PlusCircle
          size={24}
          color={isDarkMode ? "#ffffff" : "#ffffff"}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TaskInput;
