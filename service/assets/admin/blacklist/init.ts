import type { IconLakeAPI } from '../../exhibition/api'

(() => {
  const iconlakeAPI = (window as any).iconlakeAPI as IconLakeAPI
  if (!iconlakeAPI) {
    console.error('window.iconlakeAPI is not defined')
    return
  }

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

  const cachedInfo = {
    classId: '',
    nftId: '',
    author: ''
  }
  const getInfo = async () => {
    cachedInfo.classId = iconlakeAPI.class.id
    cachedInfo.nftId = iconlakeAPI.nft.id
    if (iconlakeAPI.nft.id) {
      cachedInfo.author = await iconlakeAPI.nft.getInfo().then(res => res.data.author)
    } else if (iconlakeAPI.class.id) {
      cachedInfo.author = await iconlakeAPI.class.getInfo().then(res => res.data.author)
    }
  }
  getInfo()

  createBtn('封禁作者', async () => {
    const address = prompt('作者账户地址:', cachedInfo.author ?? '')
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
    const address = prompt('作者账户地址:', cachedInfo.author ?? '')
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
    const projectId = prompt('项目ID:', cachedInfo.classId ?? '')
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
    const projectId = prompt('项目ID:', cachedInfo.classId ?? '')
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

  if (!iconlakeAPI.nft.id) {
    return
  }

  createGap()

  createBtn('封禁NFT', async () => {
    const projectId = prompt('项目ID:', cachedInfo.classId ?? '')
    if (!projectId) {
      return
    }
    const nftId = prompt('NFT ID:', cachedInfo.nftId ?? '')
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
    const projectId = prompt('项目ID:', cachedInfo.classId ?? '')
    if (!projectId) {
      return
    }
    const nftId = prompt('NFT ID:', cachedInfo.nftId ?? '')
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
