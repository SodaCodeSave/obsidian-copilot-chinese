import { App } from "obsidian";
import { ConfirmModal } from "./ConfirmModal";

export class NewChatConfirmModal extends ConfirmModal {
  constructor(app: App, onConfirm: () => void) {
    super(
      app,
      onConfirm,
      "开始新聊天将清除当前聊天记录。任何未保存的消息都将丢失。您确定要继续吗？",
      "开始新聊天"
    );
  }
}
