import { AcceptKeyOption } from "@/autocomplete/codemirrorIntegration";
import { WordCompletionManager } from "@/autocomplete/wordCompletion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingItem } from "@/components/ui/setting-item";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { AUTOCOMPLETE_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";
import { logError } from "@/logger";
import { updateSetting, useSettingsValue } from "@/settings/model";
import { RefreshCw } from "lucide-react";
import { Notice } from "obsidian";
import React, { useState } from "react";
import { ToolSettingsSection } from "./ToolSettingsSection";

export const CopilotPlusSettings: React.FC = () => {
  const settings = useSettingsValue();
  const currentShortcut = settings.autocompleteAcceptKey || AUTOCOMPLETE_CONFIG.KEYBIND;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isAutocompleteTemporarilyDisabled = true;

  // Available key options
  const keyOptions: { value: AcceptKeyOption; label: string }[] = [
    { value: "Tab", label: "Tab" },
    { value: "Space", label: "Space" },
    { value: "ArrowRight", label: "Right Arrow" },
  ];

  // Handle key option change
  const handleKeyChange = (value: AcceptKeyOption) => {
    if (isAutocompleteTemporarilyDisabled) {
      return;
    }
    updateSetting("autocompleteAcceptKey", value);
    new Notice(`Autocomplete accept key set to: ${value}`);
  };

  // Reset to default
  const resetToDefault = () => {
    if (isAutocompleteTemporarilyDisabled) {
      return;
    }
    updateSetting("autocompleteAcceptKey", AUTOCOMPLETE_CONFIG.KEYBIND as AcceptKeyOption);
    new Notice(`Autocomplete accept key reset to: ${AUTOCOMPLETE_CONFIG.KEYBIND}`);
  };

  // Handle refresh word index
  const handleRefreshWordIndex = async () => {
    if (isRefreshing || isAutocompleteTemporarilyDisabled) return;

    setIsRefreshing(true);
    new Notice("Rebuilding word index...");

    try {
      const wordManager = WordCompletionManager.getInstance(app.vault);
      const result = await wordManager.rescan((progress) => {
        if (progress.processedFiles === progress.totalFiles) {
          new Notice(
            `Word index complete! Found ${progress.foundWords} words from ${progress.processedFiles} files.`
          );
        }
      });

      new Notice(`Word index rebuilt successfully! ${result.wordCount} unique words indexed.`);
    } catch (error) {
      logError("Failed to refresh word index:", error);
      new Notice("Failed to refresh word index. Check console for details.");
    } finally {
      setIsRefreshing(false);
    }
  };

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

          <div className="tw-pt-4 tw-text-xl tw-font-semibold">
            自动补全
            <span className="tw-ml-2 tw-text-sm tw-font-normal tw-text-muted">
              (服务暂时不可用，即将恢复)
            </span>
          </div>

          {isAutocompleteTemporarilyDisabled ? null : (
            <>
              <SettingItem
                type="switch"
                title="句子自动补全"
                description={
                  <div className="tw-flex tw-items-center tw-gap-1.5">
                    <span className="tw-leading-none">启用AI驱动的句子自动补全建议（打字时）</span>
                  </div>
                }
                checked={settings.enableAutocomplete}
                onCheckedChange={(checked) => {
                  if (isAutocompleteTemporarilyDisabled) {
                    return;
                  }
                  updateSetting("enableAutocomplete", checked);
                }}
                disabled={isAutocompleteTemporarilyDisabled}
              />

              <SettingItem
                type="switch"
                title="单词补全"
                description="根据您的Vault内容为部分输入的单词提供补全建议。至少需要3个字符才能触发。"
                checked={settings.enableWordCompletion}
                onCheckedChange={(checked) => {
                  if (isAutocompleteTemporarilyDisabled) {
                    return;
                  }
                  updateSetting("enableWordCompletion", checked);
                }}
                disabled={isAutocompleteTemporarilyDisabled}
              />

              <SettingItem
                type="custom"
                title="单词索引管理"
                description="重建单词索引以包含Vault中的新单词。索引会在插件加载时自动构建。"
                disabled={isAutocompleteTemporarilyDisabled}
              >
                <Button
                  onClick={handleRefreshWordIndex}
                  disabled={isRefreshing || isAutocompleteTemporarilyDisabled}
                  className="tw-flex tw-items-center tw-gap-2"
                >
                  <RefreshCw className={cn("tw-size-4", isRefreshing && "tw-animate-spin")} />
                  {isRefreshing ? "正在重建..." : "刷新单词索引"}
                </Button>
              </SettingItem>

              <SettingItem
                type="custom"
                title="自动补全接受建议键"
                description={
                  <div className="tw-flex tw-items-center tw-gap-1.5">
                    <span className="tw-leading-none">用于接受自动补全建议的按键</span>
                    <HelpTooltip
                      content={
                        <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2">
                          <div className="tw-text-sm tw-text-muted">
                            选择您要用于接受建议的按键。默认是 &quot;Tab&quot;。
                          </div>
                        </div>
                      }
                    />
                  </div>
                }
                disabled={isAutocompleteTemporarilyDisabled}
              >
                <div className="tw-flex tw-items-center tw-gap-2">
                  <Select
                    value={currentShortcut}
                    onValueChange={handleKeyChange}
                    disabled={isAutocompleteTemporarilyDisabled}
                  >
                    <SelectTrigger
                      className="tw-w-[180px]"
                      disabled={isAutocompleteTemporarilyDisabled}
                    >
                      <SelectValue placeholder="选择按键" />
                    </SelectTrigger>
                    <SelectContent>
                      {keyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentShortcut && currentShortcut !== AUTOCOMPLETE_CONFIG.KEYBIND && (
                    <Button
                      variant="ghost"
                      onClick={resetToDefault}
                      className="tw-h-8 tw-text-xs"
                      disabled={isAutocompleteTemporarilyDisabled}
                    >
                      重置为默认值
                    </Button>
                  )}
                </div>
              </SettingItem>

              <SettingItem
                type="switch"
                title="允许额外上下文"
                description="允许AI访问相关笔记以提供更相关的建议。关闭时，AI只能看到当前笔记上下文。"
                checked={settings.allowAdditionalContext}
                onCheckedChange={(checked) => {
                  if (isAutocompleteTemporarilyDisabled) {
                    return;
                  }
                  updateSetting("allowAdditionalContext", checked);
                }}
                disabled={isAutocompleteTemporarilyDisabled}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};
