/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
const creator = '老张'
function getData(){
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        params: {
            creator
        }
    }).then(result => {
        console.log(result.data.data);
        const bookLists = result.data.data
        const htmlStr = bookLists.map((item, index) => {
        return `<tr>
        <td>${index + 1}</td>
        <td>${item.bookname}</td>
        <td>${item.author}</td>
        <td>${item.publisher}</td>
        <td data-id=${item.id}>
          <span class="del">删除</span>
          <span class="edit">编辑</span>
        </td>
      </tr>`
    }).join('')
    document.querySelector('.list').innerHTML = htmlStr
    })
    
}
getData()

// 创建弹框--添加弹框
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)
 document.querySelector('.add-btn').addEventListener('click', () => {
    const addForm = document.querySelector('.add-form')
    const bookObj = serialize(addForm, {hash: true, empty: true})
    // 获取到用户新增数据，提交到服务器
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        method: 'POST',
        data: {
            ...bookObj,
            creator
        }
    }).then(result => {
        console.log(result);
        getData()
        // 重置表单
        addForm.reset()
        addModal.hide()
    })
 })

//  删除---事件委托
 document.querySelector('.list').addEventListener('click', e => {
    // 1.找到要删除的图书id
    if(e.target.classList.contains('del')){
        console.log('点击删除元素')
        // 拿到他爸的id，从而找到图书id
        const theId = e.target.parentNode.dataset.id
        axios({
            url: `http://hmajax.itheima.net/api/books/${theId}`,
            method: 'DELETE'

        }).then(result => {
            console.log(result.data.message);
            getData()
        })

    }
 })

//  编辑
const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)
document.querySelector('.list').addEventListener('click', e => {
    if(e.target.classList.contains('edit')){
        // 先请求显示原数据
        const theId = e.target.parentNode.dataset.id
        axios({
            url: `http://hmajax.itheima.net/api/books/${theId}`
        }).then(result => {
            const bookObj = result.data.data
            const keys = Object.keys(bookObj)
            keys.forEach(key => {
                document.querySelector(`.edit-form .${key}`).value = bookObj[key]
            })

        })
        editModal.show()
    }
})

// 修改按钮
document.querySelector('.edit-btn').addEventListener('click', () => {
    const editForm = document.querySelector('.edit-form')
    const bookObj = serialize(editForm, { hash: true, empty: true})
    console.log(bookObj)
    
})
// 隐藏弹框
document.querySelector('.edit-btn').addEventListener('click', () => {
    editModal.hide()
})