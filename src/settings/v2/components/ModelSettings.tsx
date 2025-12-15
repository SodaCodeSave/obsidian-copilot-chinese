import { CustomModel } from "@/aiParams";
import { SettingItem } from "@/components/ui/setting-item";
import { BUILTIN_CHAT_MODELS, BUILTIN_EMBEDDING_MODELS } from "@/constants";
import EmbeddingManager from "@/LLMProviders/embeddingManager";
import ProjectManager from "@/LLMProviders/projectManager";
import { logError } from "@/logger";
import { CopilotSettings, setSettings, updateSetting, useSettingsValue } from "@/settings/model";
import { ModelAddDialog } from "@/settings/v2/components/ModelAddDialog";
import { ModelEditModal } from "@/settings/v2/components/ModelEditDialog";
import { ModelTable } from "@/settings/v2/components/ModelTable";
import { omit } from "@/utils";
import { Notice } from "obsidian";
import React, { useState } from "react";

export const ModelSettings: React.FC = () => {
  const settings = useSettingsValue();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddEmbeddingDialog, setShowAddEmbeddingDialog] = useState(false);

  const onCopyModel = (model: CustomModel, isEmbeddingModel: boolean = false) => {
    const newModel: CustomModel = {
      ...omit(model, [
        "isBuiltIn",
        "core",
        "projectEnabled",
        "plusExclusive",
        "believerExclusive",
        "capabilities",
        "displayName",
        "dimensions",
      ]),
      name: `${model.name} (副本)`,
    };

    const settingField: keyof CopilotSettings = isEmbeddingModel
      ? "activeEmbeddingModels"
      : "activeModels";

    updateSetting(settingField, [...settings[settingField], newModel]);
  };

  const handleModelReorder = (newModels: CustomModel[], isEmbeddingModel: boolean = false) => {
    const settingField: keyof CopilotSettings = isEmbeddingModel
      ? "activeEmbeddingModels"
      : "activeModels";
    updateSetting(settingField, newModels);
  };

  const onDeleteModel = (modelKey: string) => {
    const [modelName, provider] = modelKey.split("|");
    const updatedActiveModels = settings.activeModels.filter(
      (model) => !(model.name === modelName && model.provider === provider)
    );

    let newDefaultModelKey = settings.defaultModelKey;
    if (modelKey === settings.defaultModelKey) {
      const newDefaultModel = updatedActiveModels.find((model) => model.enabled);
      newDefaultModelKey = newDefaultModel
        ? `${newDefaultModel.name}|${newDefaultModel.provider}`
        : "";
    }

    setSettings({
      activeModels: updatedActiveModels,
      defaultModelKey: newDefaultModelKey,
    });
  };

  const handleModelUpdate = (
    isEmbeddingModel: boolean,
    originalModel: CustomModel,
    updatedModel: CustomModel
  ) => {
    const settingField: keyof CopilotSettings = isEmbeddingModel
      ? "activeEmbeddingModels"
      : "activeModels";

    const modelIndex = settings[settingField].findIndex(
      (m) => m.name === originalModel.name && m.provider === originalModel.provider
    );
    if (modelIndex !== -1) {
      const updatedModels = [...settings[settingField]];
      updatedModels[modelIndex] = updatedModel;
      updateSetting(settingField, updatedModels);
    } else {
      new Notice("无法找到要更新的模型");
      logError("无法找到要更新的模型:", originalModel);
    }
  };

  // 处理来自ModelTable本身的更新（例如，复选框切换）
  const handleTableUpdate = (updatedModel: CustomModel) => {
    const updatedModels = settings.activeModels.map((m) =>
      m.name === updatedModel.name && m.provider === updatedModel.provider ? updatedModel : m
    );
    updateSetting("activeModels", updatedModels);
  };

  const onDeleteEmbeddingModel = (modelKey: string) => {
    const [modelName, provider] = modelKey.split("|");
    const updatedModels = settings.activeEmbeddingModels.filter(
      (model) => !(model.name === modelName && model.provider === provider)
    );
    updateSetting("activeEmbeddingModels", updatedModels);
  };

  const handleEmbeddingModelUpdate = (updatedModel: CustomModel) => {
    const updatedModels = settings.activeEmbeddingModels.map((m) =>
      m.name === updatedModel.name && m.provider === updatedModel.provider ? updatedModel : m
    );
    updateSetting("activeEmbeddingModels", updatedModels);
  };

  const handleRefreshChatModels = () => {
    // 获取所有自定义模型（非内置模型）
    const customModels = settings.activeModels.filter((model) => !model.isBuiltIn);

    // 创建包含内置模型和自定义模型的新数组
    const updatedModels = [...BUILTIN_CHAT_MODELS, ...customModels];

    // 更新设置
    updateSetting("activeModels", updatedModels);
    new Notice("聊天模型刷新成功");
  };

  const handleRefreshEmbeddingModels = () => {
    // 获取所有自定义模型（非内置模型）
    const customModels = settings.activeEmbeddingModels.filter((model) => !model.isBuiltIn);

    // 创建包含内置模型和自定义模型的新数组
    const updatedModels = [...BUILTIN_EMBEDDING_MODELS, ...customModels];

    // 更新设置
    updateSetting("activeEmbeddingModels", updatedModels);
    new Notice("嵌入模型刷新成功");
  };

  const handleEditModel = (model: CustomModel, isEmbeddingModel: boolean = false) => {
    const modal = new ModelEditModal(app, model, isEmbeddingModel, handleModelUpdate);
    modal.open();
  };

  return (
    <div className="tw-space-y-4">
      <section>
        <ModelTable
          models={settings.activeModels}
          onEdit={(model) => handleEditModel(model)}
          onCopy={(model) => onCopyModel(model)}
          onDelete={onDeleteModel}
          onAdd={() => setShowAddDialog(true)}
          onUpdateModel={handleTableUpdate}
          onReorderModels={(newModels) => handleModelReorder(newModels)}
          onRefresh={handleRefreshChatModels}
          title="聊天模型"
        />

        {/* 添加模型对话框 */}
        <ModelAddDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={(model) => {
            const updatedModels = [...settings.activeModels, model];
            updateSetting("activeModels", updatedModels);
          }}
          ping={(model) =>
            ProjectManager.instance.getCurrentChainManager().chatModelManager.ping(model)
          }
        />

        <div className="tw-space-y-4">
          <SettingItem
            type="slider"
            title="上下文对话轮数"
            description="要包含在上下文中的之前对话轮数。默认是15轮，即30条消息。"
            value={settings.contextTurns}
            onChange={(value) => updateSetting("contextTurns", value)}
            min={1}
            max={50}
            step={1}
          />
        </div>
      </section>

      <section>
        <ModelTable
          models={settings.activeEmbeddingModels}
          onEdit={(model) => handleEditModel(model, true)}
          onDelete={onDeleteEmbeddingModel}
          onCopy={(model) => onCopyModel(model, true)}
          onAdd={() => setShowAddEmbeddingDialog(true)}
          onUpdateModel={handleEmbeddingModelUpdate}
          onReorderModels={(newModels) => handleModelReorder(newModels, true)}
          onRefresh={handleRefreshEmbeddingModels}
          title="嵌入模型"
        />

        {/* 添加嵌入模型对话框 */}
        <ModelAddDialog
          open={showAddEmbeddingDialog}
          onOpenChange={setShowAddEmbeddingDialog}
          onAdd={(model) => {
            const updatedModels = [...settings.activeEmbeddingModels, model];
            updateSetting("activeEmbeddingModels", updatedModels);
          }}
          isEmbeddingModel={true}
          ping={(model) => EmbeddingManager.getInstance().ping(model)}
        />
      </section>
    </div>
  );
};
