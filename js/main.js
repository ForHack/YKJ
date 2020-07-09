document.addEventListener('DOMContentLoaded', function(){
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var name_input = document.getElementById('DateFirst')
    name_input.value = day + "." + month + "." + year;
	var name_input2 = document.getElementById('DateFirstPay')
    name_input2.value = day + "." + Math.abs(month + 1) + "." + year;
});


function Payment(date, sum) {
  this.date = date;
  this.sum = sum;
}

function parseDate(input, format) {
  format = format || 'yyyy-mm-dd'; // default format
  var parts = input.match(/(\d+)/g), 
      i = 0, fmt = {};
  // extract date-part indexes from the format
  format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

  return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
}

function nrm(val, to) {
    var t = Math.round(val * to),
        tt = t / to;
    return tt;
}
function format_num(str1) {
    var retstr = '',
        now = 0,
        str,
        i,
        numb = Math.floor(str1),
        ost = Math.round((str1 - numb) * 100);
    str = String(numb);
    for (i = str.length - 1; i >= 0; i -= 1) {
        if (now < 3) {
            now += 1;
            retstr = str.charAt(i) + retstr;
        } else {
            now = 1;
            retstr = str.charAt(i) + ' ' + retstr;
        }
    }
    return retstr + '.' + String(ost);
}

function chkdate(dt1,x){
    var d = new Date(dt1.getFullYear(),dt1.getMonth()+x,0);
    

    if(dt1.getDate()>d.getDate()){
        var newdt = new Date(dt1.getFullYear(),dt1.getMonth()+x-1,d.getDate());    
    }
    else{
        var newdt = new Date(dt1.getFullYear(),dt1.getMonth()+x-1,dt1.getDate());   
    }
    var wkd = newdt.getDay();
    if (newdt.getDay() === 6) {
        newdt.setDate(newdt.getDate()+2);
    }
    if (newdt.getDay() === 0) {
        newdt.setDate(newdt.getDate()+1);
    }

    return newdt;
}

function getDaysBetween (d1,d2){
	d1.setHours(13,0,0,0);
	d2.setHours(13,0,0,0);
	var diff = d2.getTime() - d1.getTime();	
	return diff;
	
}

function NarPrc(dt1, dt2, Rt){
	var Srok=[];
	var DayMonth=[];
	var PartRt=[];
	var PartRtAll=0;
	var SrokAll=0;
	var dY1=dt1.getFullYear();
	var dY2=dt2.getFullYear();
	intCountY= dY2 - dY1 + 1;
	
	for (l = 1; l<= intCountY; l += 1){
		if(intCountY === 1){
			Srok[l]=getDaysBetween(dt1,dt2)/(60*60*24*1000);
		}
		else if(intCountY === l){
			Srok[l]=getDaysBetween(dt1,dt2)/(60*60*24*1000)-SrokAll;
		}
		else if(intCountY != l){
			Srok[l]=getDaysBetween(dt1,new Date(dY1 + l - 1,11,31))/(60*60*24*1000)-SrokAll;
		}
		SrokAll=SrokAll+Srok[l];
	}
	
	for (l = 1; l<= intCountY; l += 1){
		var dYf=dY1+l-1;
		DayMonth[l] = (new Date(dYf,11,31) - new Date(dYf,0,0))/86400000;
	}
	
	if(intCountY === 1){
		PartRt[1]=Srok[1]/DayMonth[1];
		PartRtAll=PartRt[1];
	}
	else{
		for (l = 1; l<= intCountY; l += 1){
			PartRt[l] = Srok[l]/DayMonth[l];
			PartRtAll=PartRtAll+PartRt[l];
		}	
	}
	var Prt= Rt * PartRtAll;
	return Prt;
}

function Operation() {
    var vSum = 0,
        vTerm = 0,
		vPay=0,
        Com1 = 0,
        Com2 = 0,
        sp1 = 0,
        sp2 = 0,
		intDays = 0,
		intDayInYear = 0,
        dates = [],
        values = [],
        ann = 0,
        vProc = 0,
        ezm = 0,
        vAnP = 0,
        mp = 0,
        ep = [],
        l = 0,
        x = 0,
        oz = 0,
        ssum = 0,
        com3 = 0,
        com4 = 0,
        xirr,
        typeCalc = 0,
        typeComOne = 0,
        typeComMult = 0,
		typePayment=0,
        iPay = 0,
        dtFrstDay = 0,
        dtFrstMn = 0,
        dtFrstY = 0,
        dtFrstChk= Boolean(""),
        dtFrst=new Date(),
        dtFrstN=new Date(),
        dtFrstPay=new Date(),
		aPayment=[];
		tableOfPayments = "";

    // Присвоение переменных    
    if (document.getElementById("amntCredit")) {
        vSum = parseFloat(document.getElementById("amntCredit").value) || 400000;
    }
    
    if(document.getElementById("term")){
       vTerm = parseFloat(document.getElementById("term").value) || 12;
    }

    if(document.getElementById("CommisOne")){
        Com1 = parseFloat(document.getElementById("CommisOne").value) || 0;
    }

    if(document.getElementById("CommisMult")){
        Com2 = parseFloat(document.getElementById("CommisMult").value) || 0;
    }
	
	if(document.getElementById("Payment")){
        vPay = parseFloat(document.getElementById("Payment").value) || 37053.8;
    }

    if(document.getElementById("DateFirstPay")){
        dtFrstPay.setTime(Date.parse(document.getElementById("DateFirstPay").value));
		dtFrstPay.setTime(parseDate(document.getElementById("DateFirstPay").value,'dd.mm.yyyy'));
    }
	
	if(document.getElementById("DateFirst")){
        dtFrst.setTime(parseDate(document.getElementById("DateFirst").value,'dd.mm.yyyy'));
    }
	
	
	if(document.getElementById("DateFirstChk")){
        dtFrstChk = document.getElementById("DateFirstChk").checked ;
    }

    vProc = parseFloat(document.getElementById("nominalRate").value.replace(/[,.]/g, '.')) || 20;
    vProc = vProc / 1200;

    //Определение алгоритма расчета
    if (document.getElementById('ch1').checked) {
        typeCalc = document.getElementById('ch1').value;
    }
    if (document.getElementById('ch2').checked) {
        typeCalc = document.getElementById('ch2').value;
    }
    if (document.getElementById('ch3').checked) {
        typeCalc = document.getElementById('ch3').value;
    }
    if (document.getElementById('ch4').checked) {
        typeCalc = document.getElementById('ch4').value;
    }


    //Определение типа разовой комиссии
    if (document.getElementById('commisOneRadioPr').checked) {
        typeComOne = document.getElementById('commisOneRadioPr').value;
    }
//    if (document.getElementById('commisOneRadioSm').checked) {
//        typeComOne = document.getElementById('commisOneRadioSm').value;
//    }
//    //    if (document.getElementById('commisOneRadioSm').checked) {
//        typeComOne = document.getElementById('commisOneRadioSm').value;
//    }
//    
    //Определение типа многократной комисии

    if (document.getElementById('commisMultRadioPr').checked) {
        typeComMult = document.getElementById('commisMultRadioPr').value;
    }
//    if (document.getElementById('commisMultRadioSm').checked) {
//        typeComMult = document.getElementById('commisMultRadioSm').value;
//    }

    //Определение типа платежа

    if (document.getElementById('Annuitet').checked) {
        typePayment = document.getElementById('Annuitet').value;
    }
    if (document.getElementById('different').checked) {
        typePayment = document.getElementById('different').value;
    }
     
	
	// алгаритмы расчета
	
	switch (typeCalc) {
		case "1":
			//расчитать сумму кредита
			if(dtFrstChk){
				vAnP=(vProc+vProc/(Math.pow(1+vProc,vTerm-1)-1))*100;
			}
			else{
				vAnP=(vProc+vProc/(Math.pow(1+vProc,vTerm)-1))*100;
			}
			vSum=(vPay/vAnP)*100;
			vSum=nrm(vSum,1);
			ann=vPay;
			document.calculator.amntCredit.value=vSum;
			break;
		
		case "2":
			// рассчитать ставку
			ann=vPay;
			break;
		
		case "3":
			//рассчитать срок
			vTerm = nrm(Math.log(vPay/(vPay-vProc*vSum)) / Math.log(1+vProc),1);
			ann=vPay;
			break;
		
		case "4":
			//рассчитать платеж
			if(dtFrstChk){
				vAnP = (vProc + vProc / (Math.pow(1 + vProc, vTerm - 1) - 1)) * 100;
			}
			else{
				vAnP = (vProc + vProc / (Math.pow(1 + vProc, vTerm) - 1)) * 100;
			}
			
			ezm = vAnP * vSum / 100;
			ann = nrm(ezm, 100);
			//расчет платежа
			document.calculator.Payment.value = ann;
			break;
	}
	//присвоение значений по умолчанию

    if(!parseFloat(document.getElementById("term").value)) {
        document.calculator.term.value = 12;
    }

    if(!parseFloat(document.getElementById("amntCredit").value)) {
        document.calculator.amntCredit.value = 400000;
    }

    if(!parseFloat(document.getElementById("nominalRate").value)) {
        document.calculator.nominalRate.value = 20;
    }
	
	 if(!parseFloat(document.getElementById("Payment").value)) {
        document.calculator.Payment.value = 37053.8;
    }

    document.calculator.eRate.value = "";
    document.calculator.interest.value = "";
    document.calculator.allPay.value = "";
    
    mp = vSum * vProc / (1 - 1 / Math.pow((1 + vProc), vTerm));

    // комиссии
//    if (Com1 < 100) {
//        sp1 = 1 ; // комиссия в процентах
//    } else {
//        sp1 = 2; // комиссия в валюта
//    }   
//
//    if (Com2 < 100) {
//        sp2 = 1 ; // комиссия в процентах
//    } else {
//        sp2 = 2; // комиссия в валюта
//    }   

    //Расчет эфективной ставки

//	for (l = 0; l < vTerm; l += 1) {
//        oz = vSum - (vSum / vTerm) * l;
//        ep[l] = {percent: vSum / vTerm + oz * vProc};
//        ssum += ep[l].percent;
//    }

    for (x = 0; x <= vTerm; x += 1) {
        if (x === 0) {
            mmm = dtFrst;
        }
        else
        {
            mmm = chkdate(dtFrstPay, x);
        };
        
        aPayment[x] = new Payment(new Date(mmm),0);
        
		if (x === 0) {
            if (typeComOne === "1") {
				if(Com1 > 85){
					Com1 = 85;
					document.getElementById("CommisOne").value = 85;
				}
                aPayment[x].sum = vSum - vSum * Com1 / 100;
            } else {
				if(Com1 * 0.9 > vSum){
					Com1 = vSum * 0.8;
					document.getElementById("CommisOne").value = vSum * 0.8;
				}
                aPayment[x].sum = vSum - Com1;
            }
		} 
	}
   
	if( Com2 > 0 )
            {
				if (typeComMult === "1") {
					if(Com2 > 50){
					Com1 = 50;
					document.getElementById("CommisMult").value = 85;
					}
				} else {
					if(Com2 > vSum*0.5){
					Com1 = vSum*0.5;
					document.getElementById("CommisMult").value = vSum*0.5;
					}
					other_payments += Com2;
				}
				
               
            }
	
    if (typeComOne === "1") {
        com3 = vSum * Com1 / 100;
    } else {
        com3 = Com1;
    }

    

    
	if(typeCalc == "2")	 {
		document.calculator.nominalRate.value = nrm(xirr * 100, 100);
	}


    // Вывод таблицы


    tableOfPayments += "<table class=\"paymentTbl\" cellspacing=\"0\" cellpadding=\"0\">\n";
    tableOfPayments += "<thead><tr class='blue'>\n";
    tableOfPayments += "<th class=\"firstcol\">№</th>\n";
    tableOfPayments += "<th>To'lov sanasi</th>\n";
    tableOfPayments += "<th>Kredit Summasi</th>\n";
    tableOfPayments += "<th class=\"lastcol\">Kredit Foiz</th>\n";
    tableOfPayments += "<th>Asosiy qarz</th>\n";
    tableOfPayments += "<th>Bir oylik jami to'lovlar</th>\n";
    tableOfPayments += "</tr></thead>\n";
    tableOfPayments += "<tbody>\n";
	
	tableOfPayments += "<tr class='green'>";
    tableOfPayments += "<td class=\"firstcol\">1</td>\n";
    tableOfPayments += "<td>" +  ('0' + aPayment[0].date.getDate()).slice(-2) + "." + ('0' +(aPayment[0].date.getMonth() + 1)).slice(-2) + "." + aPayment[0].date.getFullYear()+"</td>\n";
    

    var myAmntCreditBase = +document.querySelector('#amntCredit').value;
    var myTermBase = +document.querySelector('#term').value;
    var myNominalRateBase = +document.querySelector('#nominalRate').value;
    tableOfPayments += `<td>${myAmntCreditBase}</td>\n`;
    var perMonthSum = ((+(aPayment[0].sum.toFixed(2)) * myNominalRateBase) / (365*3) + +(myAmntCreditBase / myTermBase).toFixed(2))
    // var test = (aPayment[0].sum.toFixed(2))
    console.log(typeof myNominalRateBase)
    tableOfPayments += "<td class=\"lastcol\">" + (((aPayment[0].sum.toFixed(2)) * myNominalRateBase) / (365*3)).toFixed(2) + "</td>\n";
    tableOfPayments += `<td>${(myAmntCreditBase / myTermBase).toFixed(2)}</td>\n`;
    tableOfPayments += `<td>${perMonthSum.toFixed(0)}</td>\n`;
    tableOfPayments += "</tr>\n";
	
	
	
    var credit_sum = 0;
    var payments = 0;
    var credit_procent_100 = 0;
    var payments_delta = 0;
    var saldo = 0;
    var sum_body = 0;
    var sum_procent = 0;
    var sum_other_payments = 0;
    var sum_sum = 0;

    if( typePayment == 2 )
    {
        credit_sum = vSum;
		
		if(dtFrstChk){
			payments = nrm( credit_sum / (vTerm - 1), 100 );
			payments_delta = nrm( credit_sum - payments * (vTerm-1), 100 );
		}
		else{
			payments = nrm( credit_sum / vTerm, 100 );
			payments_delta = nrm( credit_sum - payments * vTerm, 100 );
		}
		
        
        credit_procent_100 = vProc * 12;

        
        saldo = credit_sum;

        sum_body = 0;
        sum_procent = 0;
        sum_other_payments = 0;
        sum_sum = 0;
//        tableOfPayments += "<tbody>\n";
        for( i = 1; i <= vTerm - 1 ; i++ )
        {
            console.log(i)
            tableOfPayments += "<tr" + ( (i+1)%12 == 0 ? ' class="year_delimiter"' : '' ) + ">\n";
            tableOfPayments += "<td>" + (i + 1)  +  "</td>\n";
            tableOfPayments += "<td>" +  ('0' + aPayment[i].date.getDate()).slice(-2) + "." + ('0' +(aPayment[i].date.getMonth() + 1)).slice(-2) + "." + aPayment[i].date.getFullYear()+"</td>\n";

			body = payments;
            if( i == vTerm ){
				body = payments + payments_delta;
			}
			
			procent = nrm(saldo*NarPrc(aPayment[i-1].date, aPayment[i].date, credit_procent_100), 100);
            sum_body += body;
			sum_procent += procent;
            other_payments = 0;


            if( Com2 > 0 )
            {
				if (typeComMult === "1") {
					other_payments += credit_sum*Com2/100;
					} else {
					other_payments += Com2;
				}
				
               
            }

            if( other_payments > 0 )
            {
             //   tableOfPayments += "<td>" + nrm(other_payments,100) + "</td>\n";
                sum_other_payments += other_payments;
            }
            else { 
			//	tableOfPayments += "<td>&nbsp;</td>\n";
			}
			
			if(dtFrstChk && i == 1){
				aPayment[i].sum= (procent + other_payments)*-1;
			}
			else{
				aPayment[i].sum= (body + procent + other_payments)*-1;
				saldo -= body;
			}
            
            ///////////////////////////////EDIT HERE//////////////////////////////////////////
            // Kredit summasi
            tableOfPayments += "<td>"   + nrm(saldo,100).toFixed(2) + "</td>\n";
               // Kredit foiz
                var myRate = document.querySelector('#nominalRate').value;
                // ((nrm(saldo, 100).toFixed(2) * myRate) / (365*30)).toFixed(2)
                
               var creditPer  =  ((+nrm(saldo,100).toFixed(2)* myRate) / (365*30)).toFixed(2)
               tableOfPayments += ` <td> ${creditPer}</td>\n`;
               var myAmntCredit = document.querySelector('#amntCredit').value;
               var myTerm = document.querySelector('#term').value;
               // Asosiy qarz
               var debtPer = (myAmntCredit / myTerm).toFixed(2)
               tableOfPayments += `<td>${ debtPer }</td>\n`;
               sum_sum += aPayment[i].sum;
            // Bir oylik jami To'lovlar	
            // tableOfPayments += "<td>" +   nrm(aPayment[i].sum*-1,100).toFixed(2) + "</td>\n";
            tableOfPayments += `<td>${(Math.round(creditPer) + Math.round(debtPer))} </td>\n`;
         
         
           
            console.log()

            tableOfPayments += "</tr>\n";
            
        }
    }
    else
    {
		//ануитет
        credit_sum = vSum;
        credit_procent_100 = vProc * 12;
        payments = ann;
        saldo = credit_sum;

        sum_body = 0;
        sum_procent = 0;
        sum_other_payments = 0;
        sum_sum = 0;
//        tableOfPayments += "<tbody>\n";
        for( i = 1; i <= vTerm; i++ )
        {
			
//			intDays = (getDaysBetween (dates[i-1],dates[i])/(60*60*24*1000));
//					   
//			intDayInYear = (new Date(dates[i].getFullYear(),11,31) - new Date(dates[i].getFullYear(),0,0))/86400000;
			
            tableOfPayments += "<tr" +  ( (i+1)%12 == 0 ? ' class="year_delimiter"' : '' ) + ">\n";
            tableOfPayments += "<td>" + (i) + "</td>\n";
            tableOfPayments += "<td>" +  ('0' + aPayment[i].date.getDate()).slice(-2) + "." + ('0' +(aPayment[i].date.getMonth() + 1)).slice(-2) + "." + aPayment[i].date.getFullYear()+"</td>\n";


            procent = nrm(saldo*NarPrc(aPayment[i-1].date,aPayment[i].date,credit_procent_100),100);
			//procent = nrm(saldo*credit_procent_100*intDays/intDayInYear,100);
			
            body = payments - procent;
			
            if( i == vTerm )
            {
                payments_delta = saldo - body;
                body = body + payments_delta;
                payments = payments + payments_delta;
            }
			
            //tableOfPayments += "<td>" + nrm(body,100) + "</td>\n";
            sum_body += body;
            //tableOfPayments += "<td>" + nrm(procent,100) + "</td>\n";
            sum_procent += procent;

            other_payments = 0;
            if( i == 0 && Com1 > 0 )
            {
                other_payments += credit_sum*Com1/100;
            }
			
            if( Com2 > 0 )
            {
				if (typeComMult === "1") {
					other_payments += credit_sum*Com2/100;
					} else {
					other_payments += Com2;
				}
				
               
            }

            if( other_payments > 0 )
            {
             //   tableOfPayments += "<td>" + nrm(other_payments,100) + "</td>\n";
                sum_other_payments += other_payments;
            }
            else {
			//	tableOfPayments += "<td>&nbsp;</td>\n";
			}

			if(dtFrstChk && i == 1){
				aPayment[i].sum = (procent + other_payments)*-1;
			}
			else{
				aPayment[i].sum = (body + procent + other_payments)*-1;
				saldo -= body;
			}
			
			sum_sum += aPayment[i].sum;
			
			tableOfPayments += "<td>"+   nrm(saldo,100).toFixed(2) + "</td>\n";
			tableOfPayments += "<td>"  + nrm(aPayment[i].sum*-1,100).toFixed(2) + "</td>\n";
			
			
            tableOfPayments += "</tr>\n";
            
        }
    }
    tableOfPayments += "</tbody>";
    tableOfPayments += "</table>\n";

	 for( i = 0; i < aPayment.length; i++ ){
		 dates[i]=aPayment[i].date;
		 values[i]=aPayment[i].sum;
	 }

    document.getElementById("Payments").innerHTML = tableOfPayments;
	
	document.calculator.allPay.value = format_num(nrm(vSum+sum_procent, 100));
    document.calculator.interest.value = format_num(nrm(sum_procent, 100));

    xirr = Satpathy.Financial.xirr(dates, values);
    document.calculator.eRate.value = format_num(nrm(xirr * 100, 100));
	
    return true;
}

//function Operation() {
//    var vSum = 0,
//        vTerm = 0,
//		vPay=0,
//        Com1 = 0,
//        Com2 = 0,
//        sp1 = 0,
//        sp2 = 0,
//		intDays = 0,
//		intDayInYear = 0,
//        dates = [],
//        values = [],
//        ann = 0,
//        vProc = 0,
//        ezm = 0,
//        vAnP = 0,
//        mp = 0,
//        ep = [],
//        l = 0,
//        x = 0,
//        oz = 0,
//        ssum = 0,
//        com3 = 0,
//        com4 = 0,
//        xirr,
//        typeCalc = 0,
//        typeComOne = 0,
//        typeComMult = 0,
//		typePayment=0,
//        iPay = 0,
//        dtFrstDay = 0,
//        dtFrstMn = 0,
//        dtFrstY = 0,
//        dtFrstChk= Boolean(""),
//        dtFrst=new Date(),
//        dtFrstN=new Date(),
//        dtFrstPay=new Date(),
//		tableOfPayments = "";
//
//    // Присвоение переменных    
//    if (document.getElementById("amntCredit")) {
//        vSum = parseFloat(document.getElementById("amntCredit").value) || 400000;
//    }
//    
//    if(document.getElementById("term")){
//       vTerm = parseFloat(document.getElementById("term").value) || 12;
//    }
//
//    if(document.getElementById("CommisOne")){
//        Com1 = parseFloat(document.getElementById("CommisOne").value) || 0;
//    }
//
//    if(document.getElementById("CommisMult")){
//        Com2 = parseFloat(document.getElementById("CommisMult").value) || 0;
//    }
//	
//	if(document.getElementById("Payment")){
//        vPay = parseFloat(document.getElementById("Payment").value) || 37053.8;
//    }
//
//    if(document.getElementById("DateFirstPay")){
//        //dtFrstPay.setTime(Date.parse(document.getElementById("DateFirstPay").value));
//		dtFrstPay.setTime(parseDate(document.getElementById("DateFirstPay").value,'dd.mm.yyyy'));
//    }
//	
//	if(document.getElementById("DateFirst")){
//        dtFrst.setTime(parseDate(document.getElementById("DateFirst").value,'dd.mm.yyyy'));
//    }
//	
//	
//	if(document.getElementById("DateFirstChk")){
//        dtFrstChk = document.getElementById("DateFirstChk").checked ;
//    }
//
//    dtFrstDay=dtFrst.getDate();
//    dtFrstMn=dtFrst.getMonth();
//    dtFrstY=dtFrst.getFullYear();
//
//    vProc = parseFloat(document.getElementById("nominalRate").value.replace(/[,.]/g, '.')) || 20;
//    vProc = vProc / 1200;
//
//    //Определение алгоритма расчета
//    if (document.getElementById('ch1').checked) {
//        typeCalc = document.getElementById('ch1').value;
//    }
//    if (document.getElementById('ch2').checked) {
//        typeCalc = document.getElementById('ch2').value;
//    }
//    if (document.getElementById('ch3').checked) {
//        typeCalc = document.getElementById('ch3').value;
//    }
//    if (document.getElementById('ch4').checked) {
//        typeCalc = document.getElementById('ch4').value;
//    }
//
//
//    //Определение типа разовой комиссии
//    if (document.getElementById('commisOneRadioPr').checked) {
//        typeComOne = document.getElementById('commisOneRadioPr').value;
//    }
////    if (document.getElementById('commisOneRadioSm').checked) {
////        typeComOne = document.getElementById('commisOneRadioSm').value;
////    }
////    
//    //Определение типа многократной комисии
//
//    if (document.getElementById('commisMultRadioPr').checked) {
//        typeComMult = document.getElementById('commisMultRadioPr').value;
//    }
////    if (document.getElementById('commisMultRadioSm').checked) {
////        typeComMult = document.getElementById('commisMultRadioSm').value;
////    }
//
//    //Определение типа платежа
//
//    if (document.getElementById('Annuitet').checked) {
//        typePayment = document.getElementById('Annuitet').value;
//    }
//    if (document.getElementById('different').checked) {
//        typePayment = document.getElementById('different').value;
//    }
//     
//	
//	// алгаритмы расчета
//	
//	switch (typeCalc) {
//		case "1":
//			//расчитать сумму кредита
//			if(dtFrstChk){
//				vAnP=(vProc+vProc/(Math.pow(1+vProc,vTerm-1)-1))*100;
//			}
//			else{
//				vAnP=(vProc+vProc/(Math.pow(1+vProc,vTerm)-1))*100;
//			}
//			vSum=(vPay/vAnP)*100;
//			vSum=nrm(vSum,1);
//			ann=vPay;
//			document.calculator.amntCredit.value=vSum;
//			break;
//		
//		case "2":
//			// рассчитать ставку
//			ann=vPay;
//			break;
//		
//		case "3":
//			//рассчитать срок
//			vTerm = nrm(Math.log(vPay/(vPay-vProc*vSum)) / Math.log(1+vProc),1);
//			ann=vPay;
//			break;
//		
//		case "4":
//			//рассчитать платеж
//			if(dtFrstChk){
//				vAnP = (vProc + vProc / (Math.pow(1 + vProc, vTerm - 1) - 1)) * 100;
//			}
//			else{
//				vAnP = (vProc + vProc / (Math.pow(1 + vProc, vTerm) - 1)) * 100;
//			}
//			
//			ezm = vAnP * vSum / 100;
//			ann = nrm(ezm, 100);
//			//расчет платежа
//			document.calculator.Payment.value = ann;
//			break;
//	}
//	//присвоение значений по умолчанию
//
//    if(!parseFloat(document.getElementById("term").value)) {
//        document.calculator.term.value = 12;
//    }
//
//    if(!parseFloat(document.getElementById("amntCredit").value)) {
//        document.calculator.amntCredit.value = 400000;
//    }
//
//    if(!parseFloat(document.getElementById("nominalRate").value)) {
//        document.calculator.nominalRate.value = 20;
//    }
//	
//	 if(!parseFloat(document.getElementById("Payment").value)) {
//        document.calculator.Payment.value = 37053.8;
//    }
//
//    document.calculator.eRate.value = "";
//    document.calculator.interest.value = "";
//    document.calculator.allPay.value = "";
//    
//    mp = vSum * vProc / (1 - 1 / Math.pow((1 + vProc), vTerm));
//
//    // комиссии
////    if (Com1 < 100) {
////        sp1 = 1 ; // комиссия в процентах
////    } else {
////        sp1 = 2; // комиссия в валюта
////    }   
////
////    if (Com2 < 100) {
////        sp2 = 1 ; // комиссия в процентах
////    } else {
////        sp2 = 2; // комиссия в валюта
////    }   
//
//    //Расчет эфективной ставки
//    for (l = 0; l < vTerm; l += 1) {
//        oz = vSum - (vSum / vTerm) * l;
//        ep[l] = vSum / vTerm + oz * vProc;
//        ssum += ep[l];
//    }
//
//    for (x = 0; x <= vTerm; x += 1) {
//        if (x === 0) {
//            mmm = dtFrst;
//        }
//        else
//        {
//            mmm = chkdate(dtFrstPay, x);
//        };
//        
//        dates[x] = new Date(mmm);
//        if (x === 0) {
//            if (typeComOne === "1") {
//                values[x] = vSum - vSum * Com1 / 100;
//            } else {
//                values[x] = vSum - Com1;
//            }
//        } else {
//                if (typeComMult === "1") {
//                    values[x] = ann * -1 - vSum * Com2 / 100;
//                } else {
//                    values[x] = ann * -1 - Com2;
//                }
//            }
//        }
//   
//
//    if (typeComOne === "1") {
//        com3 = vSum * Com1 / 100;
//    } else {
//        com3 = Com1;
//    }
//
//    if (typeComMult === "1") {
//        com4 = vSum * Com2 / 100;
//    } else {
//        com4 = Com2;
//    }
//
//    document.calculator.allPay.value = format_num(nrm(mp * vTerm  + com4 * vTerm, 100));
//    document.calculator.interest.value = format_num(nrm(mp * vTerm + com3 + com4 * vTerm - vSum, 100));
//
//    xirr = Satpathy.Financial.xirr(dates, values);
//    document.calculator.eRate.value = format_num(nrm(xirr * 100, 100));
//	
//	if(typeCalc == "2")	 {
//		document.calculator.nominalRate.value = nrm(xirr * 100, 100);
//	}
//
//
//    // Вывод таблицы
//
//
//    tableOfPayments += "<table class=\"paymentTbl\" cellspacing=\"0\" cellpadding=\"0\">\n";
//    tableOfPayments += "<thead><tr>\n";
//    tableOfPayments += "<th class=\"firstcol\">№</th>\n";
//    tableOfPayments += "<th>Дата платежа</th>\n";
//    tableOfPayments += "<th>Остаток по кредиту</th>\n";
//    tableOfPayments += "<th class=\"lastcol\">Ежемесячный платеж</th>\n";
//    tableOfPayments += "</tr></thead>\n";
//
//    var credit_sum = 0;
//    var payments = 0;
//    var credit_procent_100 = 0;
//    var payments_delta = 0;
//    var saldo = 0;
//    var sum_body = 0;
//    var sum_procent = 0;
//    var sum_other_payments = 0;
//    var sum_sum = 0;
//
//    if( typePayment == 2 )
//    {
//        credit_sum = vSum;
//		
//		if(dtFrstChk){
//			payments = nrm( credit_sum / (vTerm - 1), 100 );
//			payments_delta = nrm( credit_sum - payments * (vTerm-1), 100 );
//		}
//		else{
//			payments = nrm( credit_sum / vTerm, 100 );
//			payments_delta = nrm( credit_sum - payments * vTerm, 100 );
//		}
//		
//        
//        credit_procent_100 = vProc * 12;
//
//        
//        saldo = credit_sum;
//
//        sum_body = 0;
//        sum_procent = 0;
//        sum_other_payments = 0;
//        sum_sum = 0;
//        tableOfPayments += "<tbody>\n";
//        for( i = 1; i <= vTerm; i++ )
//        {
//            tableOfPayments += "<tr" + ( (i+1)%12 == 0 ? ' class="year_delimiter"' : '' ) + ">\n";
//            tableOfPayments += "<td>" + (i) + "</td>\n";
//            tableOfPayments += "<td>" +  ('0' + dates[i].getDate()).slice(-2) + "." + ('0' +(dates[i].getMonth() + 1)).slice(-2) + "." + dates[i].getFullYear()+"</td>\n";
//
//			body = payments;
//            if( i == vTerm ){
//				body = payments + payments_delta;
//			}
//			
//			procent = nrm(saldo*NarPrc(dates[i-1],dates[i],credit_procent_100),100);
//            sum_body += body;
//			sum_procent += procent;
//            other_payments = 0;
//
//			if( i == 0 && Com1 > 0 )
//            {
//                other_payments += credit_sum*Com1/100;
//            }
//            if( Com2 > 0 )
//            {
//                other_payments += credit_sum*Com2/100;
//            }
//
//            if( other_payments > 0 )
//            {
//             //   tableOfPayments += "<td>" + nrm(other_payments,100) + "</td>\n";
//                sum_other_payments += other_payments;
//            }
//            else { 
//			//	tableOfPayments += "<td>&nbsp;</td>\n";
//			}
//			
//			if(dtFrstChk && i == 1){
//				sum = procent + other_payments;
//			}
//			else{
//				sum = body + procent + other_payments;
//				saldo -= body;
//			}
//			
//			tableOfPayments += "<td>" + nrm(saldo,100).toFixed(2) + "</td>\n";
//            tableOfPayments += "<td>" + nrm(sum,100).toFixed(2) + "</td>\n";
//            sum_sum += sum;
//
//            tableOfPayments += "</tr>\n";
//            
//        }
//    }
//    else
//    {
//		//ануитет
//        credit_sum = vSum;
//        credit_procent_100 = vProc * 12;
//        payments = ann;
//        saldo = credit_sum;
//
//        sum_body = 0;
//        sum_procent = 0;
//        sum_other_payments = 0;
//        sum_sum = 0;
//        tableOfPayments += "<tbody>\n";
//        for( i = 1; i <= vTerm; i++ )
//        {
//			
//			intDays = (getDaysBetween (dates[i-1],dates[i])/(60*60*24*1000));
//					   
//			intDayInYear = (new Date(dates[i].getFullYear(),11,31) - new Date(dates[i].getFullYear(),0,0))/86400000;
//			
//            tableOfPayments += "<tr" + ( (i+1)%12 == 0 ? ' class="year_delimiter"' : '' ) + ">\n";
//            tableOfPayments += "<td>" + (i) + "</td>\n";
//            tableOfPayments += "<td>" +  ('0' + dates[i].getDate()).slice(-2) + "." + ('0' +(dates[i].getMonth() + 1)).slice(-2) + "." + dates[i].getFullYear()+"</td>\n";
//
//
//            procent = nrm(saldo*NarPrc(dates[i-1],dates[i],credit_procent_100),100);
//			//procent = nrm(saldo*credit_procent_100*intDays/intDayInYear,100);
//			
//            body = payments - procent;
//			
//            if( i == vTerm )
//            {
//                payments_delta = saldo - body;
//                body = body + payments_delta;
//                payments = payments + payments_delta;
//            }
//			
//            //tableOfPayments += "<td>" + nrm(body,100) + "</td>\n";
//            sum_body += body;
//            //tableOfPayments += "<td>" + nrm(procent,100) + "</td>\n";
//            sum_procent += procent;
//
//            other_payments = 0;
//            if( i == 0 && Com1 > 0 )
//            {
//                other_payments += credit_sum*Com1/100;
//            }
//            if( Com2 > 0 )
//            {
//                other_payments += credit_sum*Com2/100;
//            }
//
//            if( other_payments > 0 )
//            {
//             //   tableOfPayments += "<td>" + nrm(other_payments,100) + "</td>\n";
//                sum_other_payments += other_payments;
//            }
//            else {
//			//	tableOfPayments += "<td>&nbsp;</td>\n";
//			}
//
//			if(dtFrstChk && i == 1){
//				sum = procent + other_payments;
//			}
//			else{
//				sum = body + procent + other_payments;
//				saldo -= body;
//			}
//			
//			sum_sum += sum;
//			
//			tableOfPayments += "<td>" +  nrm(saldo,100).toFixed(2) + "</td>\n";
//			tableOfPayments += "<td>" + nrm(sum,100).toFixed(2) + "</td>\n";
//			
//			
//            tableOfPayments += "</tr>\n";
//            
//        }
//    }
//    tableOfPayments += "</tbody>";
//    tableOfPayments += "</table>\n";
//
//
//
//    document.getElementById("Payments").innerHTML = tableOfPayments;
//
//    return true;
//}




function  clearField(nameField){
    //document.getElementById(nameField).value = "";
	switch (nameField){
		  case "amntCredit":
            document.getElementById("amntCredit").readOnly=true;
            document.getElementById("term").readOnly=false;
            document.getElementById("Payment").readOnly=false;
            document.getElementById("nominalRate").readOnly=false;
            break;
        
        case "nominalRate":

			document.getElementById("amntCredit").readOnly=false;
            document.getElementById("term").readOnly=false;
            document.getElementById("Payment").readOnly=false;
            document.getElementById("nominalRate").readOnly=true;
            break;
        
        case "term":

            document.getElementById("amntCredit").readOnly=false;
            document.getElementById("term").readOnly=true;
            document.getElementById("Payment").readOnly=false;
            document.getElementById("nominalRate").readOnly=false;
            break;
        
        case "Payment":

            document.getElementById("amntCredit").readOnly=false;
            document.getElementById("term").readOnly=false;
            document.getElementById("Payment").readOnly=true;
            document.getElementById("nominalRate").readOnly=false;            
            break;
	}
}

function Recalc(){

    
        vSum = parseFloat(document.getElementById("amntCredit").value) || 1000000;
        vTerm = parseFloat(document.getElementById("term").value) || 12;
        vPay = parseFloat(document.getElementById("Payment").value) || 37053.8;
        vProc = parseFloat(document.getElementById("nominalRate").value.replace(/[,.]/g, '.')) || 15;
        vProc = vProc / 1200;
    

    if (document.getElementById("amntCredit").value === 0) {
        document.getElementById("amntCredit").value = 400000;
    }
    
    if(document.getElementById("term").value === 0){
       document.getElementById("term").value = 12;
    }

    if(document.getElementById("Payment").value === 0){
       document.getElementById("Payment").value = 37053.8;
    }
    
    if(document.getElementById("nominalRate").value === 0){
       document.getElementById("nominalRate").value = 20;
    }

  
    if (document.getElementById('ch1').checked) {
        typeCalc = document.getElementById('ch1').value;
    }
    if (document.getElementById('ch2').checked) {
        typeCalc = document.getElementById('ch2').value;
    }
    if (document.getElementById('ch3').checked) {
        typeCalc = document.getElementById('ch3').value;
    }
    if (document.getElementById('ch4').checked) {
        typeCalc = document.getElementById('ch4').value;
    }

    switch (typeCalc) {
        case "1":
            //расчитать сумму кредита
            vAnP=(vProc+vProc/(Math.pow(1+vProc,vTerm)-1))*100;

            vSum=(vPay/vAnP)*100;   
            vSum=nrm(vSum,1);
            ann=vPay;
            document.calculator.amntCredit.value=vSum;

            break;
        
        case "2":
            // рассчитать ставку
            ann=vPay;
            break;
        
        case "3":
            //рассчитать срок
            vTerm = nrm(Math.log(vPay/(vPay-vProc*vSum)) / Math.log(1+vProc),1);
            document.calculator.term.value=vTerm;

            break;
        
        case "4":
            //рассчитать платеж
            vAnP = (vProc + vProc / (Math.pow(1 + vProc, vTerm) - 1)) * 100;
            ezm = vAnP * vSum / 100;
            ann = nrm(ezm, 100);

            document.calculator.Payment.value = ann;
            break;
    }

}

function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

function RepayAdd(){
	
	var Repaydt= new Date();
	var extraamount= 0;
 
	if(document.getElementById("AmntRepay")){
    extraamount = parseFloat(document.getElementById("AmntRepay").value);
    }

    if(document.getElementById("DateRepay")){
	Repaydt.setTime(parseDate(document.getElementById("DateRepay").value,'dd.mm.yyyy'));
    }
	
	
	var Repaylist = document.getElementById('repay');
	var li = document.createElement("li");
	var children = Repaylist.children.length + 1;
    li.setAttribute("id", "element"+children);
	li.appendChild(document.createTextNode(('0' + Repaydt.getDate()).slice(-2) + "." + ('0' +(Repaydt.getMonth() + 1)).slice(-2) + "." + Repaydt.getFullYear() + " - " + extraamount));
	Repaylist.appendChild(li);
}

function GetRepay(){
	

	
	var Repaylist = document.getElementById('repay');
	var li = document.getElementById('repay').getElementsByTagName('li').length;
	for (var i = 0; i < li; i++){
    	var children= Repaylist.children[i].innerHTML;
		var xx = children.split(' - ');
    }
	
}

function chkFieldData(){
	if (document.getElementById("DateFirstChk").checked){
		document.getElementById("DateFirstPay").disabled =false;
		
	}else{
		document.getElementById("DateFirstPay").disabled =true;
	}
}

function setFieldDateFrsPay(){
	
	if (document.getElementById("DateFirstChk").checked){
				
	}else{
		if(document.getElementById("DateFirst")){
			var y =parseDate(document.getElementById("DateFirst").value,'dd.mm.yyyy');
		}
		var z = chkdate(y,2);	
		document.getElementById("DateFirstPay").value=('0' + z.getDate()).slice(-2) + "." + ('0' +(z.getMonth() + 1)).slice(-2) + "." + z.getFullYear();
	}
	
}

function compareFieldDateFrsPay(){
	 var dtFrst=new Date();
     var dtFrstPay=new Date();
		 
	 dtFrstPay.setTime(parseDate(document.getElementById("DateFirstPay").value,'dd.mm.yyyy'));
	 dtFrst.setTime(parseDate(document.getElementById("DateFirst").value,'dd.mm.yyyy'));
    
	if (dtFrstPay <= dtFrst){
		var z = chkdate(dtFrst,2);	
		document.getElementById("DateFirstPay").value=('0' + z.getDate()).slice(-2) + "." + ('0' +(z.getMonth() + 1)).slice(-2) + "." + z.getFullYear();
	}
}
