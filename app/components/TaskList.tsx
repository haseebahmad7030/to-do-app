import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Check, Edit2, Trash2, Save } from "lucide-react-native";
import Reanimated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

// Local fallback context
const FallbackThemeContext = createContext({ isDarkMode: false });

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, newText: string) => void; // ✅ updated
  onDeleteTask: (id: string) => void;
  isDarkMode?: boolean;
}

const TaskList = ({
  tasks = [],
  onToggleComplete = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  isDarkMode: propIsDarkMode,
}: TaskListProps) => {
  const themeContext = useContext(FallbackThemeContext);
  const isDarkMode =
    propIsDarkMode !== undefined ? propIsDarkMode : themeContext.isDarkMode;

  // Local state to track editing task
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      onEditTask(id, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const renderItem = ({ item }: { item: Task }) => {
    const isEditing = editingId === item.id;

    return (
      <Reanimated.View
        layout={Layout}
        entering={FadeIn}
        exiting={FadeOut}
        className={`flex-row items-center justify-between p-4 mb-2 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{
          shadowColor: isDarkMode ? "#000" : "#888",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Toggle complete */}
        <TouchableOpacity
          onPress={() => onToggleComplete(item.id)}
          className="flex-row items-center flex-1"
          disabled={isEditing} // disable toggle while editing
        >
          <View
            className={`w-6 h-6 rounded-full mr-3 items-center justify-center ${
              item.completed
                ? isDarkMode
                  ? "bg-purple-600"
                  : "bg-blue-500"
                : "border border-gray-400"
            }`}
          >
            {item.completed && <Check size={16} color="white" />}
          </View>

          {/* Show text or TextInput if editing */}
          {isEditing ? (
            <TextInput
              value={editText}
              onChangeText={setEditText}
              autoFocus
              className={`flex-1 px-2 py-1 rounded ${
                isDarkMode ? "text-white bg-gray-700" : "text-gray-900 bg-gray-200"
              }`}
              placeholder="Edit task..."
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              onSubmitEditing={() => handleSaveEdit(item.id)}
            />
          ) : (
            <Text
              className={`text-base ${
                item.completed
                  ? "line-through " +
                    (isDarkMode ? "text-gray-500" : "text-gray-400")
                  : isDarkMode
                  ? "text-white"
                  : "text-gray-800"
              }`}
              numberOfLines={1}
            >
              {item.text}
            </Text>
          )}
        </TouchableOpacity>

        {/* Action buttons */}
        <View className="flex-row">
          {isEditing ? (
            <TouchableOpacity
              onPress={() => handleSaveEdit(item.id)}
              className="p-2 mr-2"
            >
              <Save size={18} color={isDarkMode ? "#a3e635" : "#16a34a"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setEditingId(item.id);
                setEditText(item.text);
              }}
              className="p-2 mr-2"
            >
              <Edit2 size={18} color={isDarkMode ? "#a3a3a3" : "#666666"} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => onDeleteTask(item.id)} className="p-2">
            <Trash2 size={18} color={isDarkMode ? "#a3a3a3" : "#666666"} />
          </TouchableOpacity>
        </View>
      </Reanimated.View>
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <Text
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No tasks yet. Add a task to get started!
          </Text>
        </View>
      )}
    </View>
  );
};

export default TaskList;
