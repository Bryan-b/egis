exports.is_category_exist = async (model, data) => {
    await model.findOne({
      where : data
    })
}