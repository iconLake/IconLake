(() => {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '0'
  container.style.right = '0'
  container.style.bottom = '0'
  container.style.zIndex = '999'
  container.style.display = 'flex'
  container.style.justifyContent = 'center'
  container.style.alignItems = 'center'
  container.style.gap = '1rem'
  container.style.backgroundColor = 'rgba(0,0,0,0.5)'
  container.style.color = '#fff'
  container.style.padding = '1rem'
  document.body.appendChild(container)

  const createBtn = (text: string, cb: () => void) => {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.onclick = async () => {
      btn.disabled = true
      await cb()
      btn.disabled = false
    }
    container.appendChild(btn)
  }

  const createGap = () => {
    const gap = document.createElement('div')
    gap.style.width = '1rem'
    gap.style.height = '1rem'
    container.appendChild(gap)
  }

  const getInfo = () => {
    let info: {
      classId?: string
      id?: string
      data?: {
        author?: string
      }
    } = {}
    try {
      info = JSON.parse(document.querySelector('iconlake-nft')?.getAttribute('info') ?? '{}')
    } catch (e) {
      console.error(e)
      alert('无法解析信息')
    }
    return info
  }

  createBtn('封禁作者', async () => {
    const address = prompt('作者账户地址:', getInfo().data?.author ?? '')
    if (!address) {
      return
    }
    const result = await fetch('/api/admin/blacklist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        address
      })
    }).then(res => res.json())
    if (result.error) {
      alert(result.error)
    } else {
      location.reload()
    }
  })

  createBtn('解封作者', async () => {
    const address = prompt('作者账户地址:', getInfo().data?.author ?? '')
    if (!address) {
      return
    }
    const result = await fetch('/api/admin/blacklist/del', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        address
      })
    }).then(res => res.json())
    if (result.error) {
      alert(result.error)
    } else {
      location.reload()
    }
  })

  createGap()

  createBtn('封禁项目', async () => {
    const projectId = prompt('项目ID:', getInfo().classId ?? '')
    if (!projectId) {
      return
    }
    const result = await fetch('/api/admin/blacklist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        projectId
      })
    }).then(res => res.json())
    if (result.error) {
      alert(result.error)
    } else {
      location.reload()
    }
  })

  createBtn('解封项目', async () => {
    const projectId = prompt('项目ID:', getInfo().classId ?? '')
    if (!projectId) {
      return
    }
    const result = await fetch('/api/admin/blacklist/del', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        projectId
      })
    }).then(res => res.json())
    if (result.error) {
      alert(result.error)
    } else {
      location.reload()
    }
  })

  createGap()

  createBtn('封禁NFT', async () => {
    const projectId = prompt('项目ID:', getInfo().classId ?? '')
    if (!projectId) {
      return
    }
    const nftId = prompt('NFT ID:', getInfo().id ?? '')
    if (!nftId) {
      return
    }
    const result = await fetch('/api/admin/blacklist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        projectId,
        nftId
      })
    }).then(res => res.json())
    if (result.error) {
      alert(result.error)
    } else {
      location.reload()
    }
  })

  createBtn('解封NFT', async () => {
    const projectId = prompt('项目ID:', getInfo().classId ?? '')
    if (!projectId) {
      return
    }
    const nftId = prompt('NFT ID:', getInfo().id ?? '')
    if (!nftId) {
      return
    }
    const result = await fetch('/api/admin/blacklist/del', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        projectId,
        nftId
      })
    }).then(res => res.json())
    if (result.error) {
      alert(result.error)
    } else {
      location.reload()
    }
  })
})()
