
class IndexPage extends React.Component<any, any> {
    render() {
        return [
            <div key="row1" className="row">
                <div className="col-md-4">
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-success" style={{ fontWeight: 'bold' }}>
                            今日注册用户
                        </li>
                        <li className="list-group-item">
                            张三
                        </li>
                        <li className="list-group-item">
                            李四
                        </li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-success" style={{ fontWeight: 'bold' }}>
                            今日订单
                        </li>
                        <li className="list-group-item">
                            张三
                        </li>
                        <li className="list-group-item">
                            李四
                        </li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-success" style={{ fontWeight: 'bold' }}>
                            今日订单
                    </li>
                        <li className="list-group-item">
                            张三
                    </li>
                        <li className="list-group-item">
                            李四
                    </li>
                    </ul>
                </div>
            </div>
        ]
    }
}

export default function (page: chitu.Page) {
    ReactDOM.render(<IndexPage />, page.element)
}
