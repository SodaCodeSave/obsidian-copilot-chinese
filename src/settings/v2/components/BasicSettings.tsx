import { ChainType } from "@/chainFactory";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { Input } from "@/components/ui/input";
import { getModelDisplayWithIcons } from "@/components/ui/model-display";
import { SettingItem } from "@/components/ui/setting-item";
import { DEFAULT_OPEN_AREA, PLUS_UTM_MEDIUMS, SEND_SHORTCUT } from "@/constants";
import { cn } from "@/lib/utils";
import { createPlusPageUrl } from "@/plusUtils";
import { getModelKeyFromModel, updateSetting, useSettingsValue } from "@/settings/model";
import { PlusSettings } from "@/settings/v2/components/PlusSettings";
import { checkModelApiKey, formatDateTime } from "@/utils";
import { Key, Loader2 } from "lucide-react";
import { Notice } from "obsidian";
import React, { useState } from "react";
import { ApiKeyDialog } from "./ApiKeyDialog";

const ChainType2Label: Record<ChainType, string> = {
  [ChainType.LLM_CHAIN]: "聊天",
  [ChainType.VAULT_QA_CHAIN]: "基于仓库回答 (基础)",
  [ChainType.COPILOT_PLUS_CHAIN]: "Copilot Plus",
  [ChainType.PROJECT_CHAIN]: "项目 (alpha)",
};

export const BasicSettings: React.FC = () => {
  const settings = useSettingsValue();
  const [isChecking, setIsChecking] = useState(false);
  const [conversationNoteName, setConversationNoteName] = useState(
    settings.defaultConversationNoteName || "{$date}_{$time}__{$topic}"
  );

  const applyCustomNoteFormat = () => {
    setIsChecking(true);

    try {
      // Check required variables
      const format = conversationNoteName || "{$date}_{$time}__{$topic}";
      const requiredVars = ["{$date}", "{$time}", "{$topic}"];
      const missingVars = requiredVars.filter((v) => !format.includes(v));

      if (missingVars.length > 0) {
        new Notice(`Error: Missing required variables: ${missingVars.join(", ")}`, 4000);
        return;
      }

      // Check illegal characters (excluding variable placeholders)
      const illegalChars = /[\\/:*?"<>|]/;
      const formatWithoutVars = format
        .replace(/\{\$date}/g, "")
        .replace(/\{\$time}/g, "")
        .replace(/\{\$topic}/g, "");

      if (illegalChars.test(formatWithoutVars)) {
        new Notice(`Error: Format contains illegal characters (\\/:*?"<>|)`, 4000);
        return;
      }

      // Generate example filename
      const { fileName: timestampFileName } = formatDateTime(new Date());
      const firstTenWords = "test topic name";

      // Create example filename
      const customFileName = format
        .replace("{$topic}", firstTenWords.slice(0, 100).replace(/\s+/g, "_"))
        .replace("{$date}", timestampFileName.split("_")[0])
        .replace("{$time}", timestampFileName.split("_")[1]);

      // Save settings
      updateSetting("defaultConversationNoteName", format);
      setConversationNoteName(format);
      new Notice(`Format applied successfully! Example: ${customFileName}`, 4000);
    } catch (error) {
      new Notice(`Error applying format: ${error.message}`, 4000);
    } finally {
      setIsChecking(false);
    }
  };

  const defaultModelActivated = !!settings.activeModels.find(
    (m) => m.enabled && getModelKeyFromModel(m) === settings.defaultModelKey
  );
  const enableActivatedModels = settings.activeModels
    .filter((m) => m.enabled)
    .map((model) => ({
      label: getModelDisplayWithIcons(model),
      value: getModelKeyFromModel(model),
    }));

  return (
    <div className="tw-space-y-4">
      <PlusSettings />

      {/* 通用设置部分 */}
      <section>
        <div className="tw-mb-3 tw-text-xl tw-font-bold">通用设置</div>
        <div className="tw-space-y-4">
          <div className="tw-space-y-4">
            {/* API Key部分 */}
            <SettingItem
              type="custom"
              title="API密钥"
              description={
                <div className="tw-flex tw-items-center tw-gap-1.5">
                  <span className="tw-leading-none">为不同的AI提供商配置API密钥</span>
                  <HelpTooltip
                    content={
                      <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                        <div className="tw-text-sm tw-font-medium tw-text-accent">
                          聊天和QA功能需要API密钥
                        </div>
                        <div className="tw-text-xs tw-text-muted">
                          要启用聊天和QA功能，请提供您所选提供商的API密钥。
                        </div>
                      </div>
                    }
                  />
                </div>
              }
            >
              <Button
                onClick={() => {
                  new ApiKeyDialog(app).open();
                }}
                variant="secondary"
                className="tw-flex tw-w-full tw-items-center tw-justify-center tw-gap-2 sm:tw-w-auto sm:tw-justify-start"
              >
                设置密钥
                <Key className="tw-size-4" />
              </Button>
            </SettingItem>
          </div>
          <SettingItem
            type="select"
            title="默认聊天模型"
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">选择要使用的聊天模型</span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">
                        默认模型是 OpenRouter Gemini 2.5 Flash
                      </div>
                      <div className="tw-text-xs tw-text-muted">
                        在&apos;API密钥&apos;中设置您的 OpenRouter API
                        密钥以使用此模型，或从其他提供商选择不同的模型。
                      </div>
                    </div>
                  }
                />
              </div>
            }
            value={defaultModelActivated ? settings.defaultModelKey : "Select Model"}
            onChange={(value) => {
              const selectedModel = settings.activeModels.find(
                (m) => m.enabled && getModelKeyFromModel(m) === value
              );
              if (!selectedModel) return;

              const { hasApiKey, errorNotice } = checkModelApiKey(selectedModel, settings);
              if (!hasApiKey && errorNotice) {
                // Keep selection allowed; error will surface in chat on send
              }
              updateSetting("defaultModelKey", value);
            }}
            options={
              defaultModelActivated
                ? enableActivatedModels
                : [{ label: "选择模型", value: "Select Model" }, ...enableActivatedModels]
            }
            placeholder="模型"
          />

          {/* 基本配置组 */}
          <SettingItem
            type="select"
            title="默认模式"
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">选择默认聊天模式</span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2">
                      <ul className="tw-pl-4 tw-text-sm tw-text-muted">
                        <li>
                          <strong>聊天:</strong> 用于一般对话和任务的常规聊天模式。{" "}
                          <i>使用您自己的API密钥免费使用。</i>
                        </li>
                        <li>
                          <strong>基于仓库回答 (基础):</strong>{" "}
                          使用语义搜索询问有关您的仓库内容的问题。{" "}
                          <i>使用您自己的API密钥免费使用。</i>
                        </li>
                        <li>
                          <strong>Copilot Plus:</strong> 涵盖了2个免费模式的所有功能，
                          以及高级付费功能，包括聊天上下文菜单、高级搜索、 AI代理等。查看{" "}
                          <a
                            href={createPlusPageUrl(PLUS_UTM_MEDIUMS.MODE_SELECT_TOOLTIP)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tw-text-accent hover:tw-text-accent-hover"
                          >
                            obsidiancopilot.com
                          </a>{" "}
                          for more details.
                        </li>
                      </ul>
                    </div>
                  }
                />
              </div>
            }
            value={settings.defaultChainType}
            onChange={(value) => updateSetting("defaultChainType", value as ChainType)}
            options={Object.entries(ChainType2Label).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
          />

          <SettingItem
            type="select"
            title="插件打开位置"
            description="选择插件打开的位置"
            value={settings.defaultOpenArea}
            onChange={(value) => updateSetting("defaultOpenArea", value as DEFAULT_OPEN_AREA)}
            options={[
              { label: "侧边栏视图", value: DEFAULT_OPEN_AREA.VIEW },
              { label: "编辑器", value: DEFAULT_OPEN_AREA.EDITOR },
            ]}
          />

          <SettingItem
            type="select"
            title="发送快捷键"
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">选择发送消息的键盘快捷键</span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">快捷键不工作？</div>
                      <div className="tw-text-xs tw-text-muted">
                        如果您选择的快捷键不工作，请检查
                        <strong> Obsidian设置 → 快捷键</strong>，看看是否有其他
                        命令正在使用相同的按键组合。 <br />
                        您可能需要先移除或更改冲突的快捷键。
                      </div>
                    </div>
                  }
                />
              </div>
            }
            value={settings.defaultSendShortcut}
            onChange={(value) => updateSetting("defaultSendShortcut", value as SEND_SHORTCUT)}
            options={[
              { label: "Enter", value: SEND_SHORTCUT.ENTER },
              { label: "Shift + Enter", value: SEND_SHORTCUT.SHIFT_ENTER },
            ]}
          />

          <SettingItem
            type="switch"
            title="在上下文菜单中包含当前笔记"
            description="向AI发送消息时，默认自动将当前笔记包含在聊天上下文菜单中。"
            checked={settings.includeActiveNoteAsContext}
            onCheckedChange={(checked) => {
              updateSetting("includeActiveNoteAsContext", checked);
            }}
          />

          <SettingItem
            type="switch"
            title="自动将文本选择添加到上下文"
            description="在Markdown笔记中选择文本时，自动将所选文本添加到聊天上下文中。禁用此项则使用手动命令。"
            checked={settings.autoIncludeTextSelection}
            onCheckedChange={(checked) => {
              updateSetting("autoIncludeTextSelection", checked);
            }}
          />

          <SettingItem
            type="switch"
            title="Markdown中的图片"
            description="将Markdown中的嵌入图片与文本一起传递给AI。仅适用于多模态模型。"
            checked={settings.passMarkdownImages}
            onCheckedChange={(checked) => {
              updateSetting("passMarkdownImages", checked);
            }}
          />

          <SettingItem
            type="switch"
            title="建议提示词"
            description="在聊天视图中显示建议提示词"
            checked={settings.showSuggestedPrompts}
            onCheckedChange={(checked) => updateSetting("showSuggestedPrompts", checked)}
          />

          <SettingItem
            type="switch"
            title="相关笔记"
            description="在聊天视图中显示相关笔记"
            checked={settings.showRelevantNotes}
            onCheckedChange={(checked) => updateSetting("showRelevantNotes", checked)}
          />
        </div>
      </section>

      {/* 保存对话部分 */}
      <section>
        <div className="tw-mb-3 tw-text-xl tw-font-bold">保存对话</div>
        <div className="tw-space-y-4">
          <SettingItem
            type="switch"
            title="自动保存聊天"
            description="在每条用户消息和AI回复后自动保存聊天记录。"
            checked={settings.autosaveChat}
            onCheckedChange={(checked) => updateSetting("autosaveChat", checked)}
          />

          <SettingItem
            type="switch"
            title="保存时生成AI聊天标题"
            description="启用时，使用AI模型为保存的聊天笔记生成简洁标题。禁用时，使用第一条用户消息的前10个单词。"
            checked={settings.generateAIChatTitleOnSave}
            onCheckedChange={(checked) => updateSetting("generateAIChatTitleOnSave", checked)}
          />

          <SettingItem
            type="text"
            title="默认对话文件夹名称"
            description="聊天对话将保存到的默认文件夹名称。默认是'copilot/copilot-conversations'"
            value={settings.defaultSaveFolder}
            onChange={(value) => updateSetting("defaultSaveFolder", value)}
            placeholder="copilot/copilot-conversations"
          />

          <SettingItem
            type="text"
            title="默认对话标签"
            description="保存对话时使用的默认标签。默认是'ai-conversations'"
            value={settings.defaultConversationTag}
            onChange={(value) => updateSetting("defaultConversationTag", value)}
            placeholder="ai-conversations"
          />

          <SettingItem
            type="custom"
            title="对话文件名模板"
            description={
              <div className="tw-flex tw-items-start tw-gap-1.5 ">
                <span className="tw-leading-none">自定义保存的对话笔记名称格式。</span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">
                        注意：模板中必须包含以下所有变量。
                      </div>
                      <div>
                        <div className="tw-text-sm tw-font-medium tw-text-muted">可用变量：</div>
                        <ul className="tw-pl-4 tw-text-sm tw-text-muted">
                          <li>
                            <strong>{"{$date}"}</strong>: YYYYMMDD格式的日期
                          </li>
                          <li>
                            <strong>{"{$time}"}</strong>: HHMMSS格式的时间
                          </li>
                          <li>
                            <strong>{"{$topic}"}</strong>: 聊天对话主题
                          </li>
                        </ul>
                        <i className="tw-mt-2 tw-text-sm tw-text-muted">
                          示例：{"{$date}_{$time}__{$topic}"} →
                          20250114_153232__polish_this_article_[[Readme]]
                        </i>
                      </div>
                    </div>
                  }
                />
              </div>
            }
          >
            <div className="tw-flex tw-w-[320px] tw-items-center tw-gap-1.5">
              <Input
                type="text"
                className={cn(
                  "tw-min-w-[80px] tw-grow tw-transition-all tw-duration-200",
                  isChecking ? "tw-w-[80px]" : "tw-w-[120px]"
                )}
                placeholder="{$date}_{$time}__{$topic}"
                value={conversationNoteName}
                onChange={(e) => setConversationNoteName(e.target.value)}
                disabled={isChecking}
              />

              <Button
                onClick={() => applyCustomNoteFormat()}
                disabled={isChecking}
                variant="secondary"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="tw-mr-2 tw-size-4 tw-animate-spin" />
                    Apply
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </SettingItem>
        </div>
      </section>
    </div>
  );
};
