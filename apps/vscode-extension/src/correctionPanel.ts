import * as vscode from "vscode";
import { applyApprovedCorrection, type CorrectionProposal } from "./corrections";

export class CorrectionPanel {
  static async show(proposal: CorrectionProposal) {
    const panel = vscode.window.createWebviewPanel("codepetCorrection", "CodePet Correction Review", vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = `<!doctype html><html><body style="font-family:system-ui;background:#101427;color:#eef2ff;padding:22px"><h1>Review correction</h1><p>${escapeHtml(proposal.explanation)}</p><p>Confidence: ${Math.round(proposal.confidence * 100)}% · Compiler verification: ${proposal.compilerVerified ? "passed" : "not available"}</p><h3>Original</h3><pre>${escapeHtml(proposal.originalText)}</pre><h3>Suggested</h3><pre>${escapeHtml(proposal.correctedText)}</pre><button id="accept">Accept fix</button> <button id="reject">Reject</button><script>const v=acquireVsCodeApi();document.querySelector('#accept').onclick=()=>v.postMessage({type:'accept'});document.querySelector('#reject').onclick=()=>v.postMessage({type:'reject'});</script></body></html>`;
    panel.webview.onDidReceiveMessage(async message => {
      if (message.type === "reject") { panel.dispose(); void vscode.window.showInformationMessage("CodePet correction rejected. Your file was unchanged."); }
      if (message.type === "accept") {
        try { await applyApprovedCorrection(proposal); panel.dispose(); void vscode.window.showInformationMessage("CodePet applied the approved correction. Use Undo to reverse it."); }
        catch (error) { void vscode.window.showErrorMessage(error instanceof Error ? error.message : "Could not apply correction."); }
      }
    });
  }
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]!)); }
