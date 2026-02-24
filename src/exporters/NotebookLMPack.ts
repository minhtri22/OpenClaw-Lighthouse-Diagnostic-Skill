import { Bottleneck, Guidance, ResearchPack, SevenDayPlan } from "../domain/ReportTypes";
import { promises as fs } from "fs";
import path from "path";
import { MarkdownGenerator } from "./MarkdownGenerator";

export class NotebookLMPack {
  constructor(private readonly baseDir: string = "reports") {}

  async export(
    pack: ResearchPack,
    topBottlenecks: Bottleneck[],
    guidance: Guidance[],
    plan: SevenDayPlan[]
  ): Promise<string> {
    const folder = path.join(this.baseDir, "investigation_pack");
    await fs.mkdir(folder, { recursive: true });

    const write = async (name: string, content: string) => {
      await fs.writeFile(path.join(folder, name), content, "utf-8");
    };

    const generator = new MarkdownGenerator();
    await write("executive_summary.md", `# Executive Summary\n\n${pack.title}`);
    await write(
      "top_bottlenecks.md",
      topBottlenecks
        .map(
          (b, i) =>
            `${i + 1}. ${b.type} (impact ${b.impactScore.toFixed(2)}): ${b.explanation}\nFixes: ${b.suggestedFixes.join(
              "; "
            )}`
        )
        .join("\n")
    );
    await write("optimization_simulation.md", guidance.map((g) => g.explanation).join("\n"));
    await write("ai_questions.md", guidance.flatMap((g) => g.aiQuestions).join("\n"));
    await write(
      "step_by_step_self_fix.md",
      plan.map((p) => `Day ${p.day}: ${p.focus} -> ${p.steps.join("; ")}`).join("\n")
    );
    await write("methodology.md", "Deterministic calculations based on ingested logs; no runtime enforcement.");
    await write(
      "how_to_use_notebooklm.md",
      [
        "1. Upload this folder to NotebookLM.",
        "2. Ask: 'Which issue has highest ROI?'",
        "3. Ask: 'Generate refactored prompt with 30% token reduction.'",
        "4. Ask: 'Propose caching architecture for repeated intents.'",
      ].join("\n")
    );
    const research = generator.researchPack(pack);
    await write("research_pack.md", research);
    return folder;
  }

  private slugify(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }
}
