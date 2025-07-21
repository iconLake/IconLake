export async function migrate (project) {
  const len = project.icons.length
  let updateNum = 0
  for (let i = 0; i < len; i++) {
    const icon = project.icons[i]
    if (!icon.txHash) {
      continue
    }
    icon.blockchain = {
      txHash: icon.txHash,
      height: 0,
      classId: project._id,
      nftId: icon._id
    }
    icon.txHash = undefined
    updateNum++
  }
  if (updateNum === 0) {
    return
  }
  await project.save()
  console.log(`migrate project ${project._id} ${updateNum} icons`)
}
