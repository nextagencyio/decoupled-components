import { puckHandler } from "@puckeditor/cloud-client";

export const POST = (request: Request) => {
  return puckHandler(request, {
    ai: {
      context:
        "You are helping users build landing pages for a headless Drupal CMS. " +
        "The pages are composed of reusable sections (Hero, Card Group, Side by Side, Accordion, Testimonials, Pricing, Stats, Logo Collection, Newsletter, Text Block). " +
        "Generate professional, conversion-focused content. Use realistic copy, not lorem ipsum.",
      onFinish: ({ totalCost, tokenUsage }: any) => {
        console.log(
          `[Puck AI] Cost: $${totalCost?.toFixed(4)} | Tokens: ${JSON.stringify(tokenUsage)}`
        );
      },
    },
  });
};
