import { Badge } from "@/components/ui/badge";
import { SettingItem } from "@/components/ui/setting-item";
import { updateSetting, useSettingsValue } from "@/settings/model";
import React from "react";
import { ToolSettingsSection } from "./ToolSettingsSection";

export const CopilotPlusSettings: React.FC = () => {
  const settings = useSettingsValue();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <section className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-items-center tw-py-4">
          <Badge variant="secondary" className="tw-text-accent">
            需要 Plus
          </Badge>
        </div>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-pt-4 tw-text-xl tw-font-semibold">自主代理</div>

          <SettingItem
            type="switch"
            title="启用自主代理"
            description="在Plus聊天中启用自主代理模式。AI将逐步推理并自动决定使用哪些工具，提高复杂查询的响应质量。"
            checked={settings.enableAutonomousAgent}
            onCheckedChange={(checked) => {
              updateSetting("enableAutonomousAgent", checked);
            }}
          />

          {settings.enableAutonomousAgent && (
            <>
              <ToolSettingsSection />
            </>
          )}

          <div className="tw-pt-4 tw-text-xl tw-font-semibold">记忆（实验性）</div>

          <SettingItem
            type="text"
            title="记忆文件夹名称"
            description="指定存储记忆数据的文件夹。"
            value={settings.memoryFolderName}
            onChange={(value) => {
              updateSetting("memoryFolderName", value);
            }}
            placeholder="copilot/memory"
          />

          <SettingItem
            type="switch"
            title="引用最近对话"
            description="启用后，Copilot将引用您的最近对话历史记录，提供更相关的上下文响应。所有历史数据都存储在您的Vault本地。"
            checked={settings.enableRecentConversations}
            onCheckedChange={(checked) => {
              updateSetting("enableRecentConversations", checked);
            }}
          />

          {settings.enableRecentConversations && (
            <SettingItem
              type="slider"
              title="最大最近对话数"
              description="用于上下文的最近对话数量。值越高，提供的上下文越多，但可能会减慢响应速度。"
              min={10}
              max={50}
              step={1}
              value={settings.maxRecentConversations}
              onChange={(value) => updateSetting("maxRecentConversations", value)}
            />
          )}

          <SettingItem
            type="switch"
            title="引用保存的记忆"
            description="启用后，Copilot可以访问您明确要求它记住的记忆。使用此功能存储重要事实、偏好或未来对话的上下文。"
            checked={settings.enableSavedMemory}
            onCheckedChange={(checked) => {
              updateSetting("enableSavedMemory", checked);
            }}
          />
        </div>
      </section>
    </div>
  );
};
