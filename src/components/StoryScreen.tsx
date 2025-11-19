import React from 'react';
import { CompanyStory } from '../types';

interface StoryScreenProps {
  story: CompanyStory;
  companyName: string;
  onStart: () => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({ story, companyName, onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">{companyName}</h1>
          <p className="text-xl text-slate-300">事業承継DD（デューデリジェンス）シナリオ</p>
        </div>

        {/* ストーリーコンテンツ */}
        <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur-sm border border-slate-700 space-y-8">
          
          {/* 企業の背景 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
              <span className="mr-3">🏢</span>
              企業の背景
            </h2>
            <p className="text-slate-200 leading-relaxed">{story.background}</p>
          </section>

          {/* オーナープロフィール */}
          <section className="bg-slate-900/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
              <span className="mr-3">👤</span>
              オーナープロフィール
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-semibold text-slate-400 w-24 flex-shrink-0">氏名：</span>
                <span className="text-slate-200">{story.ownerProfile.name}（{story.ownerProfile.age}歳）</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-slate-400 w-24 flex-shrink-0">経歴：</span>
                <span className="text-slate-200">{story.ownerProfile.career}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-slate-400 w-24 flex-shrink-0">悩み：</span>
                <span className="text-slate-200">{story.ownerProfile.concern}</span>
              </div>
            </div>
          </section>

          {/* 事業承継の経緯 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
              <span className="mr-3">📋</span>
              事業承継の経緯
            </h2>
            <p className="text-slate-200 leading-relaxed">{story.successionReason}</p>
          </section>

          {/* 最大の課題 */}
          <section className="bg-red-900/20 rounded-lg p-6 border border-red-800">
            <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center">
              <span className="mr-3">⚠️</span>
              最大の課題
            </h2>
            <p className="text-slate-200 leading-relaxed">{story.keyChallenge}</p>
          </section>

          {/* 従業員の状況 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400 flex items-center">
              <span className="mr-3">👥</span>
              従業員の状況
            </h2>
            <p className="text-slate-200 leading-relaxed">{story.employeesSituation}</p>
          </section>

          {/* ミッション */}
          <section className="bg-blue-900/20 rounded-lg p-6 border border-blue-700 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300 flex items-center">
              <span className="mr-3">🎯</span>
              あなたのミッション
            </h2>
            <p className="text-slate-200 leading-relaxed mb-4">
              あなたは事業承継専門のコンサルタントです。この企業の労務デューデリジェンス（労務DD）を実施し、
              <strong className="text-yellow-300">隠れた労務リスク</strong>を発見してください。
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-200">
              <li>限られた調査ポイントを使って、効果的な調査を実施する</li>
              <li>重要なリスクを見逃さず、正確に企業価値を評価する</li>
              <li>買収後のトラブルを未然に防ぐための対策を提案する</li>
            </ul>
          </section>
        </div>

        {/* スタートボタン */}
        <div className="text-center mt-10">
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            調査を開始する
          </button>
        </div>
      </div>
    </div>
  );
};
