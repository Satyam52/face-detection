import React from 'react';

const Rank = ({name,entry}) =>{
    return( 
            <div className='white f3'>
            {`${name} , your current rank is...`}
      <div className='white f1 '>
        {entry}
            </div>
        </div>
        
     );
}
export default Rank;