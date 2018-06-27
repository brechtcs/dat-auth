var form = document.querySelector('form')
var msg = document.querySelector('main')

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  form.style.display = 'none'
  msg.style.display = 'block'

  var key = form.elements.profileKey.value
  var profile, token

  try {

    var firstStep = await fetch('/auth/dat', {
      credentials: 'include'
    })
    var firstRes = await firstStep.json()

    token = firstRes.token
    profile =  await DatArchive.load(key)
    await profile.writeFile(`/${token}`, '')

    var secondStep = await fetch('/auth/dat', {
      body: JSON.stringify({profileKey: key}),
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    var secondRes = await secondStep.json()

    alert(secondRes.auth ? 'great success!' : 'epic fail.')
  } catch (e) {
    alert(e.toString())
  } finally {
    form.style.display = 'block'
    msg.style.display = 'none'

    profile.unlink(`/${token}`)
  }
})
