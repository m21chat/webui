// pages/settings.js

import React from "react";
import { Button, Radio, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const SettingsPage = () => {
  const [aiModel, setAiModel] = React.useState("model1");

  const handleModelChange = (e) => {
    setAiModel(e.target.value);
    // Add logic here to persist the selected model as the default
  };

  const handleDeleteIndexedDB = async () => {
    if (typeof window !== "undefined") {
      // IndexedDB deletion logic here
      message.success("Local IndexedDB deleted successfully");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Settings</h1>

      <section>
        <h2>Default AI Model</h2>
        <Radio.Group onChange={handleModelChange} value={aiModel}>
          <Radio value="model1">AI Model 1</Radio>
          <Radio value="model2">AI Model 2</Radio>
          {/* Add more AI models as needed */}
        </Radio.Group>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Local Data</h2>
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={handleDeleteIndexedDB}
        >
          Delete Local IndexedDB
        </Button>
      </section>
    </div>
  );
};

export default SettingsPage;
