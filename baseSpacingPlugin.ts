import plugin from "tailwindcss/plugin";

export default function baseSpacingPlugin() {
  return plugin(function ({ addComponents, theme }) {
    const baseSpacing = Object.entries(
      theme("spacing") as Record<string, string>
    )
      .filter(([key]) => key.startsWith("base-"))
      .reduce<Record<string, string>>(
        (acc, [key, value]) => ({ ...acc, [key.replace("base-", "")]: value }),
        {}
      );

    if (Object.keys(baseSpacing).length === 0) return;

    const utilities = [
      { prefix: "m", property: "margin", canBeNegative: true },
      { prefix: "p", property: "padding", canBeNegative: false },
      { prefix: "top", property: "top", canBeNegative: true },
      { prefix: "bottom", property: "bottom", canBeNegative: true },
      { prefix: "left", property: "left", canBeNegative: true },
      { prefix: "right", property: "right", canBeNegative: true },
    ] as const;

    const directions = [
      { suffix: "", sides: [""] },
      { suffix: "x", sides: ["-left", "-right"] },
      { suffix: "y", sides: ["-top", "-bottom"] },
      { suffix: "t", sides: ["-top"] },
      { suffix: "r", sides: ["-right"] },
      { suffix: "b", sides: ["-bottom"] },
      { suffix: "l", sides: ["-left"] },
    ] as const;

    const components: Record<
      string,
      Record<string, Record<string, string>>
    > = {};

    const generateStyles = (
      property: string,
      sides: readonly string[],
      value: string
    ): Record<string, string> =>
      sides.reduce(
        (acc, side) => ({ ...acc, [`${property}${side}`]: value }),
        {}
      );

    utilities.forEach(({ prefix, property, canBeNegative }) => {
      directions.forEach(({ suffix, sides }) => {
        Object.entries(baseSpacing).forEach(([breakpoint, value]) => {
          const className = `.${prefix}${suffix}-base`;
          const negativeClassName = `.-${prefix}${suffix}-base`;

          if (!components[className]) {
            components[className] = {};
          }
          if (!components[negativeClassName]) {
            components[negativeClassName] = {};
          }

          components[className][`@screen ${breakpoint}`] = generateStyles(
            property,
            sides,
            value
          );

          if (canBeNegative) {
            components[negativeClassName][`@screen ${breakpoint}`] =
              generateStyles(property, sides, `-${value}`);
          }
        });
      });
    });

    addComponents(components);
  });
}
