import './App.css';
import React from 'react';
import * as Papa from 'papaparse';
const axios = require('axios').default;

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      image: 'None',
      expression: '',
      annotations: {},
    };
  }

  onValueChange = (event) => {
    this.setState({choice: event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let file_name = this.state.image.split('/').reverse()[0];
    let img_id = file_name.substring(0, file_name.indexOf('.'));
    axios({
      url: 'http://localhost:3000/submit',
      method: 'post',
      params:{
        'img_id' : img_id,
        'exp_index': this.state.exp_index,
        response: this.state.annotations 
      }
      ,headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })
    .then( (response) => {
      console.log(response);
      document.getElementById('annotation-form').submit();
    })
    .catch(function(err){
      console.log(err);
    });
  };

  componentDidMount() {
    axios.get('http://localhost:3000/')
    .then( (response) => {
      console.log(response.data);

      this.setState({
        image: response.data.image, 
        expression: response.data.expression,
        exp_index: response.data.exp_index
      });
    })
    .catch(function(err){
      console.log(err)
    });
  }

  partOfSpeechDropdown = (i, onChangeFunc) => {
    return <select name="posDropdown1"  id={"pos"+String(i)} onChange={onChangeFunc} defaultValue="">
    <option value="">POS</option>
      <option value="NOUN">noun.ALL</option>
      <option value="VERB">verb.ALL</option>
      <option value="ADJ">adj.ALL</option>
      <option value="ADV">adv.ALL</option>
      <option value="NEG">neg.ALL</option>
      <option value="ART">art.ALL</option>
      <option value="DET">det.ALL</option>
      <option value="PRON">pron.ALL</option>
      <option value="POSS">poss.ALL</option>
      <option value="PREP">prep.ALL</option>
      <option value="CONJ">conj.ALL</option>
      <option value="INTERJ">interj.ALL</option>
      <option value="PUNC">punc.ALL</option>
      <option value="NOUN+">noun.ALL+</option>
      <option value="_nn1">noun.SG</option>
      <option value="_nn2">noun.PL</option>
      <option value="_nn0">noun.CMN</option>
      <option value="NAME">noun.+PROP</option>
      <option value="_nn">noun.-PROP</option>
      <option value="VERB+">verb.ALL+</option>
      <option value="_vv0">verb.BASE</option>
      <option value="_v?i">verb.INF</option>
      <option value="_vvi">verb.INF/LEX</option>
      <option value="_vm">verb.MODAL</option>
      <option value="_v?z">verb.3SG</option>
      <option value="_v?d">verb.ED</option>
      <option value="_v?n">verb.EN</option>
      <option value="_v?g">verb.ING</option>
      <option value="_vv">verb.LEX</option>
      <option value="_vb">verb.[BE]</option>
      <option value="_vd">verb.[DO]</option>
      <option value="_vh">verb.[HAVE]</option>
      <option value="_jjr">adj.CMP</option>
      <option value="_jjt">adj.SPRL</option>
      <option value="_rp">adv.PRTCL</option>
      <option value="_rrq">adv.WH</option>
      <option value="_pn1">pron.INDF</option>
      <option value="_pp">pron.PERS</option>
      <option value="_pnq">pron.WH</option>
      <option value="_ppx">pron.REFL</option>
      <option value="_mc">num.CARD</option>
      <option value="_md">num.ORD</option>
      <option value="_cc">conj.CRD</option>
      <option value="_cs">conj.SUB</option>
    </select>
  };

  modifierType = (onchangeFunc) => {
    return <select name="posDropdown1"  id="posDropdown1" onChange={onchangeFunc} defaultValue="">
      <option value="type">type</option>
      <option value="attr">attribute</option>
      <option value="among">relation-among</option>
      <option value='between'>relation-between</option>
    </select>
      
  };

  fieldChange = (rowId,colId, value) => {
    console.log(this.state.annotations);

    let r = this.state.annotations['row' + String(rowId)];
    if (typeof r == 'undefined') {
      r = ["","","","","", "","",""];
    }
    r[colId] = value;
    let rowName = "row" + String(rowId);
    let updatedValue = this.state.annotations;
    updatedValue[rowName] = r;
    this.setState({annotations: updatedValue});
  };

  generateRow = (row_name, i) => {

    return <tr>
      <td>{row_name}</td>
      <td><input id ={"word"+String(i)} onChange={(event) => {this.fieldChange(i, 0, event.target.value)}}/></td>
      <td><input id ={"normSpell"+String(i)} onChange={(event) => {this.fieldChange(i, 1, event.target.value)}}/></td>
      <td>{this.partOfSpeechDropdown(i, (event) => {this.fieldChange(i, 2, event.target.value)})}</td>
      <td>{this.modifierType((event) => {this.fieldChange(i, 3, event.target.value)})}</td>
      <td><input id ={"numHeads"+String(i)} onChange={(event) => {this.fieldChange(i, 4, event.target.value)}}/></td>
      <td><select name="accuracy"  id="acc" onChange={(event) => {this.fieldChange(i, 5, event.target.value)}} defaultValue="">
        <option value="exact">exactly</option>
        <option value="atleast">at least</option>
        </select>
      </td>
      <td><input id ={"headMod"+String(i)} onChange={(event) => {this.fieldChange(i, 6, event.target.value)}}/></td>
      <td><input id ={"compMod"+String(i)} onChange={(event) => {this.fieldChange(i, 6, event.target.value)}}/></td>
    </tr>
  };
  render() {
    console.log(this.state);
    let rowNames = ['head', 'modifier 1', 'modifier 2', 'modifier 3', 'modifier 4', 'modifier 5'];
 
    let rows = [];
    for (let i=0; i < rowNames.length; i++) {
      let rName = rowNames[i];
      rows.push(this.generateRow(rName,i));
    }
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Evaluating referring expression
          </p>
        </header>
        <img src={this.state.image} />
        <h5>Expression: {this.state.expression}</h5>
        <form onSubmit={this.handleSubmit} id="annotation-form">
        <table>
          <thead><tr>
            <th></th>
            <th>word(s)</th>
            <th>normalized spelling</th>
            <th>part of speech sequence</th>
            <th>semantic category</th>
            <th># of instances of head</th>
            <th>accuracy</th>
            <th>head of complex modifier</th>
            <th>Complement of complex modifier</th>
          </tr></thead>
          <tbody>
            {rows}
          </tbody>
          
        </table>
        <input type="submit" value="Submit" />
      </form>
      <br/>
      </div>
    )
  }
}



export default App;
