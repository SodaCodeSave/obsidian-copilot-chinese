import { useChainType } from "@/aiParams";
import { ChainType } from "@/chainFactory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VAULT_VECTOR_STORE_STRATEGY } from "@/constants";
import { useSettingsValue } from "@/settings/model";
import { PlusCircle, TriangleAlert } from "lucide-react";
import React, { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NotePrompt {
  title: string;
  prompts: string[];
}

const SUGGESTED_PROMPTS: Record<string, NotePrompt> = {
  activeNote: {
    title: "当前笔记洞察",
    prompts: [
      `基于 {activeNote} 提供三个后续问题，措辞要像是我在问你？`,
      `{activeNote} 回答了哪些关键问题？`,
      `用两句话快速总结 {activeNote}。`,
    ],
  },
  quoteNote: {
    title: "笔记链接聊天",
    prompts: [
      `基于 [[<note>]]，我们接下来应该关注哪些改进？`,
      `总结 [[<note>]] 的关键点。`,
      `总结 [[<note>]] 的最新更新。`,
      `批评我在 [[<note>]] 中的写作，并给出具体可操作的反馈`,
    ],
  },
  fun: {
    title: "测试LLM",
    prompts: [
      `9.11 和 9.8，哪个更大？`,
      `世界上最长的河流是什么？`,
      `如果同时从同一高度掉落铅球和羽毛，哪个会先到达地面？`,
    ],
  },
  qaVault: {
    title: "仓库问答",
    prompts: [
      `从我的笔记中，我能获得关于 <topic> 的哪些洞察？`,
      `基于我存储的笔记解释 <concept>。`,
      `突出显示我笔记中关于 <topic> 的重要细节。`,
      `基于我关于 <topic> 的笔记，我应该问但没有问的问题是什么？`,
    ],
  },
  copilotPlus: {
    title: "Copilot Plus",
    prompts: [
      `@vault 给我总结上周的内容`,
      `@vault 我的 <topic> 笔记的关键要点是什么`,
      `将 <url> 总结为不超过10个要点`,
      `总结 <youtube_video_url>`,
      `@websearch 人工智能行业的最新更新是什么`,
      `这篇论文 <arxiv_url> 的关键洞察是什么`,
      `这篇论文 [[<note_with_embedded_pdf>]] 提出了哪些新方法`,
    ],
  },
};

const PROMPT_KEYS: Record<ChainType, Array<keyof typeof SUGGESTED_PROMPTS>> = {
  [ChainType.LLM_CHAIN]: ["activeNote", "quoteNote", "fun"],
  [ChainType.VAULT_QA_CHAIN]: ["qaVault", "qaVault", "quoteNote"],
  [ChainType.COPILOT_PLUS_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],
  [ChainType.PROJECT_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],
};

function getRandomPrompt(chainType: ChainType = ChainType.LLM_CHAIN) {
  const keys = PROMPT_KEYS[chainType] || PROMPT_KEYS[ChainType.LLM_CHAIN];

  // For repeated keys, shuffle once and take multiple items
  const shuffledPrompts: Record<string, string[]> = {};

  return keys.map((key) => {
    if (!shuffledPrompts[key]) {
      shuffledPrompts[key] = [...SUGGESTED_PROMPTS[key].prompts].sort(() => Math.random() - 0.5);
    }
    return {
      title: SUGGESTED_PROMPTS[key].title,
      text: shuffledPrompts[key].pop() || SUGGESTED_PROMPTS[key].prompts[0],
    };
  });
}

interface SuggestedPromptsProps {
  onClick: (text: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onClick }) => {
  const [chainType] = useChainType();
  const prompts = useMemo(() => getRandomPrompt(chainType), [chainType]);
  const settings = useSettingsValue();
  const indexVaultToVectorStore = settings.indexVaultToVectorStore as VAULT_VECTOR_STORE_STRATEGY;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Card className="tw-w-full tw-bg-transparent">
        <CardHeader className="tw-px-2">
          <CardTitle>建议提示词</CardTitle>
        </CardHeader>
        <CardContent className="tw-p-2 tw-pt-0">
          <div className="tw-flex tw-flex-col tw-gap-2">
            {prompts.map((prompt, i) => (
              <div
                key={i}
                className="tw-flex tw-justify-between tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-border tw-p-2 tw-text-sm"
              >
                <div className="tw-flex tw-flex-col tw-gap-1">
                  <div className="tw-text-muted">{prompt.title}</div>
                  <div>{prompt.text}</div>
                </div>
                <div className="tw-flex tw-h-full tw-items-start">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost2"
                        size="fit"
                        className="tw-text-muted"
                        onClick={() => onClick(prompt.text)}
                      >
                        <PlusCircle className="tw-size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>添加到聊天</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {chainType === ChainType.VAULT_QA_CHAIN && (
        <div className="tw-rounded-md tw-border tw-border-solid tw-border-border tw-p-2 tw-text-sm">
          请注意，这是基于检索的问答系统。问题应包含字面上存在于您仓库中的关键字和概念
        </div>
      )}
      {chainType === ChainType.VAULT_QA_CHAIN &&
        indexVaultToVectorStore === VAULT_VECTOR_STORE_STRATEGY.NEVER && (
          <div className="tw-rounded-md tw-border tw-border-solid tw-border-border tw-p-2 tw-text-sm">
            <div>
              <TriangleAlert className="tw-size-4" /> 您的自动索引策略设置为
              <b>从不</b>。在继续之前，请点击下方的
              <span className="tw-text-accent">刷新索引</span>按钮，或运行
              <span className="tw-text-accent">Copilot命令：为问答索引（刷新）仓库</span>
              来更新索引。
            </div>
          </div>
        )}
    </div>
  );
};
