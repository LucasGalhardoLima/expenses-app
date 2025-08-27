// Tokens de cor primitivos e semânticos
// Paleta base
export const colorPrimitives = {
  snow: '#FCF7F8',
  black: '#000300',
  vistaBlue: '#8093F1',
  skyBlue: '#72DDF7',
  // Adicione outras cores da paleta conforme necessário
};

// Tokens semânticos (usados na UI)
export const colorSemantic = {
  background: colorPrimitives.snow,
  surface: '#FFFFFF',
  text: colorPrimitives.black,
  primary: colorPrimitives.vistaBlue,
  secondary: colorPrimitives.skyBlue,
  border: '#E0E0E0',
  success: '#4BB543', // Exemplo, ajuste conforme sua semântica
  warning: '#FFC107',
  error: '#FF5252',
  // ...outros tokens semânticos
};
