import { Button } from "@/components/ui/button";
import { SettingItem } from "@/components/ui/setting-item";
import { logFileManager } from "@/logFileManager";
import { flushRecordedPromptPayloadToLog } from "@/LLMProviders/chainRunner/utils/promptPayloadRecorder";
import { updateSetting, useSettingsValue } from "@/settings/model";
import React from "react";

export const AdvancedSettings: React.FC = () => {
  const settings = useSettingsValue();

  return (
    <div className="tw-space-y-4">
      {/* Privacy Settings Section */}
      <section>
        <SettingItem
          type="textarea"
          title="用户系统提示"
          description="自定义所有消息的系统提示，可能会导致意外行为！"
          value={settings.userSystemPrompt}
          onChange={(value) => updateSetting("userSystemPrompt", value)}
          placeholder="在此输入您的系统提示..."
        />

        <div className="tw-space-y-4">
          <SettingItem
            type="switch"
            title="启用加密"
            description="为API密钥启用加密。"
            checked={settings.enableEncryption}
            onCheckedChange={(checked) => {
              updateSetting("enableEncryption", checked);
            }}
          />

          <SettingItem
            type="switch"
            title="调试模式"
            description="调试模式会将一些调试消息记录到控制台。"
            checked={settings.debug}
            onCheckedChange={(checked) => {
              updateSetting("debug", checked);
            }}
          />

          <SettingItem
            type="custom"
            title="创建日志文件"
            description={`打开Copilot日志文件(${logFileManager.getLogPath()})，以便在报告问题时轻松共享。`}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await flushRecordedPromptPayloadToLog();
                await logFileManager.flush();
                await logFileManager.openLogFile();
              }}
            >
              创建日志文件
            </Button>
          </SettingItem>
        </div>
      </section>
    </div>
  );
};
