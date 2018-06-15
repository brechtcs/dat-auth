var form = document.querySelector('form')

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  var profileKey = form.elements.profileKey.value
  var tokenId = Date.now().toString(32)

  try {
    var profile =  await DatArchive.load(profileKey)
    await profile.writeFile(`/${tokenId}`, '3600')
    form.elements.tokenId.value = tokenId
    form.submit()
  } catch (e) {
    alert(e.toString())
  }
})
