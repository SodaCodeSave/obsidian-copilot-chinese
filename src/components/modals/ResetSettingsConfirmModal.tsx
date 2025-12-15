import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { App } from "obsidian";

export class ResetSettingsConfirmModal extends ConfirmModal {
  constructor(app: App, onConfirm: () => void) {
    super(
      app,
      onConfirm,
      "重置设置将清除所有设置并恢复默认值。您将丢失所有自定义设置，包括API密钥。您确定要继续吗？",
      "重置设置"
    );
  }
}
