import plugin from "tailwindcss/plugin";

export default function baseSpacingPlugin() {
  return plugin(function ({ addComponents, theme }) {
    const utilities = [
      { prefix: "m", property: "margin", canBeNegative: true },
      { prefix: "p", property: "padding", canBeNegative: false },
      { prefix: "top", property: "top", canBeNegative: true },
      { prefix: "bottom", property: "bottom", canBeNegative: true },
      { prefix: "left", property: "left", canBeNegative: true },
      { prefix: "right", property: "right", canBeNegative: true },
    ];

    const directions = [
      { suffix: "", sides: [""] },
      { suffix: "x", sides: ["-left", "-right"] },
      { suffix: "y", sides: ["-top", "-bottom"] },
      { suffix: "t", sides: ["-top"] },
      { suffix: "r", sides: ["-right"] },
      { suffix: "b", sides: ["-bottom"] },
      { suffix: "l", sides: ["-left"] },
    ];

    const components: { [key: string]: any } = {};

    utilities.forEach(({ prefix, property, canBeNegative }) => {
      const isPositionProperty = ["top", "bottom", "left", "right"].includes(
        prefix
      );

      if (isPositionProperty) {
        const className = `.${prefix}-base`;
        const negativeClassName = `.-${prefix}-base`;

        components[className] = {
          [property]: theme("spacing.base-sm"),
          "@screen md": { [property]: theme("spacing.base-md") },
          "@screen xl": { [property]: theme("spacing.base-xl") },
        };

        components[negativeClassName] = {
          [property]: `-${theme("spacing.base-sm")}`,
          "@screen md": { [property]: `-${theme("spacing.base-md")}` },
          "@screen xl": { [property]: `-${theme("spacing.base-xl")}` },
        };
      } else {
        directions.forEach(({ suffix, sides }) => {
          const className = `.${prefix}${suffix}-base`;

          const generateStyles = (value: string) =>
            sides.reduce(
              (acc, side) => ({
                ...acc,
                [`${property}${side}`]: value,
              }),
              {}
            );

          components[className] = {
            ...generateStyles(theme("spacing.base-sm")),
            "@screen md": generateStyles(theme("spacing.base-md")),
            "@screen xl": generateStyles(theme("spacing.base-xl")),
          };

          if (canBeNegative) {
            const negativeClassName = `.-${prefix}${suffix}-base`;
            components[negativeClassName] = {
              ...generateStyles(`-${theme("spacing.base-sm")}`),
              "@screen md": generateStyles(`-${theme("spacing.base-md")}`),
              "@screen xl": generateStyles(`-${theme("spacing.base-xl")}`),
            };
          }
        });
      }
    });

    addComponents(components);
  });
}
