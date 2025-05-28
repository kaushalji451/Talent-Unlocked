
export default function feedback(totalScore){
     if(totalScore>=90){
        return(
             <p className="text-xl py-8 font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
            Excellent work! Keep up the consistency and challenge yourself with advanced topics.
            </p>
        );
      }else if(totalScore>=75 && totalScore<=89){
        return(
             <p className="text-xl py-8 font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
            Good job! Review your incorrect answers to solidify concepts.
            </p>
        );
      }else if(totalScore>=50 && totalScore<=74){
        return(
             <p className="text-xl py-8 font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
           Decent effort. Focus on weak areas and try practicing with smaller quizzes.
            </p>
        );
      }else{
         return(
             <p className="text-xl py-8 font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
          Don't worry! Revisit foundational topics and practice regularly.
            </p>
        );
        }
}