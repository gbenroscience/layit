/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Element(options){
    this.needsRepaint = false;
    this.padding = '4px';
    this.rect = new Rectangle( 0, 0, 0, 0);
    
    this.fg = '#000';
    this.bg = 'rgb(120,120,120)';
    this.borderColor = 'rgb(255,255,255)';
    this.borderWidth = '1px';
    this.font = new Font(FontStyle.BOLD_ITALIC, fontSz, 'Arial', CssSizeUnits.EM);//new Font( "Arial", Font.PLAIN, 14);
}