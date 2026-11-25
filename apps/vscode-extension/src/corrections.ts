import * as vscode from "vscode";

export type CorrectionProposal = {
  uri: vscode.Uri;
  documentVersion: number;
  range: vscode.Range;
  originalText: string;
  correctedText: string;
  explanation: string;
  confidence: number;
  compilerVerified: boolean;
};

/** Applies a single, user-approved replacement only if analysis still matches the document. */
export async function applyApprovedCorrection(proposal: CorrectionProposal): Promise<void> {
  const document = await vscode.workspace.openTextDocument(proposal.uri);
  if (document.version !== proposal.documentVersion) throw new Error("The source changed after analysis. Request a fresh correction before applying it.");
  if (document.getText(proposal.range) !== proposal.originalText) throw new Error("The proposed range no longer matches the source. No changes were made.");
  const edit = new vscode.WorkspaceEdit();
  edit.replace(proposal.uri, proposal.range, proposal.correctedText);
  const applied = await vscode.workspace.applyEdit(edit);
  if (!applied) throw new Error("VS Code rejected the edit. No changes were made.");
  await document.save();
}
