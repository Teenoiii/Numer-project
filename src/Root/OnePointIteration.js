import { useState, useEffect } from "react";
import Plotly from "plotly.js-dist-min";
import { Button, Container, Form, Table, Spinner } from "react-bootstrap";
import { evaluate } from "mathjs";

const OnePointIteration = () => {
    const [Equation, setEquation] = useState("sqrt(13/x)");
    const [X, setX] = useState(0);
    const [X0, setX0] = useState(0);
    const [data, setData] = useState([]);
    const [html, setHtml] = useState(null);
    const [loading, setLoading] = useState(false); // ✅ เพิ่ม Loading Indicator
    const [history, setHistory] = useState([]); // ✅ เพิ่มตัวแปร History

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
        setHistory(savedHistory);
    }, []);

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const CalOnePointIteration = (x0) => {
        let xnew, ea;
        let iter = 0;
        const MAX = 50;
        const e = 0.00001;
        let results = [];

        do {
            let scope = { x: x0 };
            xnew = evaluate(Equation, scope);
            ea = error(x0, xnew);

            results.push({
                iteration: iter + 1,
                X: xnew,
                fX: evaluate(Equation, { x: xnew }),
            });

            x0 = xnew;
            iter++;
        } while (ea > e && iter < MAX);

        setX(xnew);
        setData(results);
        setHtml(renderTable(results));
        plotGraph(results);

        // ✅ บันทึก History
        const newHistory = [...history, { equation: Equation, X0, result: xnew }];
        setHistory(newHistory);
        localStorage.setItem("history", JSON.stringify(newHistory));
    };

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            CalOnePointIteration(parseFloat(X0));
            setLoading(false);
        }, 1000);
    };

    const renderTable = (results) => (
        <Container>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>X</th>
                        <th>f(X)</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((element, index) => (
                        <tr key={index}>
                            <td>{element.iteration}</td>
                            <td>{element.X.toFixed(6)}</td>
                            <td>{element.fX.toFixed(6)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );

    const plotGraph = (results) => {
        const traceX = { x: results.map((x) => x.iteration), y: results.map((x) => x.X), mode: "lines+markers", name: "X" };
        const traceFX = { x: results.map((x) => x.iteration), y: results.map((x) => x.fX), mode: "lines+markers", name: "f(X)" };

        const layout = { title: "One-Point Iteration Method", xaxis: { title: "Iteration" }, yaxis: { title: "Value" } };

        Plotly.newPlot("graphDiv", [traceX, traceFX], layout);
    };

    return (
        <Container>
            <h1>One-Point Iteration Method</h1>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Input g(x)</Form.Label>
                    <input type="text" value={Equation} onChange={(e) => setEquation(e.target.value)} className="form-control" />
                    <Form.Label>Input Initial X</Form.Label>
                    <input type="number" value={X0} onChange={(e) => setX0(parseFloat(e.target.value))} className="form-control" />
                </Form.Group>
                <Button variant="dark" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Calculate"}
                </Button>
            </Form>
            <br />
            <h5>Answer = {X.toPrecision(7)}</h5>
            {html}
            <Container>
                <div id="graphDiv"></div>
            </Container>

            {/* ✅ แสดงผลย้อนหลัง (ไม่มีปุ่ม "Use Again") */}
            <Container>
                <h2>History</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Equation</th>
                            <th>Initial X</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index}>
                                <td>{item.equation}</td>
                                <td>{item.X0}</td>
                                <td>{item.result.toFixed(6)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};

export default OnePointIteration;
