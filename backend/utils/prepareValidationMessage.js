function prepareValidationMessage(err) {
  return `Ошибка валидации: ${Object.values(err.errors).map((error) => error.properties.message).join('')}`;
}

module.exports = prepareValidationMessage;
